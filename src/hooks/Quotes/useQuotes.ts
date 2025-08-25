import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/Supabase';
import { 
  ProductQuote, 
  ClientQuote, 
  CompanyQuote, 
  QuoteItem, 
  CreateQuoteRequest, 
  UpdateQuoteRequest 
} from '@/types/quote';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<ProductQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las cotizaciones
  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('product_quote_test')
        .select(`
          *,
          client:client_quote_test(*),
          company:company_quote_test(*),
          items:quote_items_test(*)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setQuotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener cotizaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener una cotización por ID
  const fetchQuoteById = useCallback(async (id: string): Promise<ProductQuote | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('product_quote_test')
        .select(`
          *,
          client:client_quote_test(*),
          company:company_quote_test(*),
          items:quote_items_test(*)
        `)
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la cotización');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear una nueva cotización
  const createQuote = useCallback(async (quoteData: CreateQuoteRequest): Promise<ProductQuote | null> => {
    try {
      setLoading(true);
      setError(null);

      // 1. Crear cliente
      const { data: clientData, error: clientError } = await supabase
        .from('client_quote_test')
        .insert([quoteData.client])
        .select()
        .single();

      if (clientError) throw clientError;
      const clientId = clientData.id;

      // 2. Crear empresa
      const { data: companyData, error: companyError } = await supabase
        .from('company_quote_test')
        .insert([quoteData.company])
        .select()
        .single();

      if (companyError) throw companyError;
      const companyId = companyData.id;

      // 3. Generar número de cotización único
      const quoteNumber = `COT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // 4. Calcular totales
      const subtotal = quoteData.items.reduce((sum, item) => 
        sum + (item.quantity * item.unit_price) - (item.item_discount || 0), 0
      );
      const taxes = subtotal * 0.16; // 16% IVA
      const discount = 0; // Por defecto
      const total = subtotal + taxes - discount;

      // 5. Crear la cotización
      const { data: quoteDataResult, error: quoteError } = await supabase
        .from('product_quote_test')
        .insert([{
          quote_number: quoteNumber,
          client_id: clientId,
          company_id: companyId,
          quote_date: quoteData.quote_date || new Date().toISOString().split('T')[0],
          expiration_date: quoteData.expiration_date,
          status: 'draft',
          subtotal,
          taxes,
          discount,
          total,
          notes: quoteData.notes,
          terms_conditions: quoteData.terms_conditions,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (quoteError) throw quoteError;

      // 6. Crear los items de la cotización
      const itemsWithQuoteId = quoteData.items.map((item, index) => ({
        ...item,
        quote_id: quoteDataResult.id,
        item_order: index + 1
      }));

      const { error: itemsError } = await supabase
        .from('quote_items_test')
        .insert(itemsWithQuoteId);

      if (itemsError) throw itemsError;

      // 7. Obtener la cotización completa con relaciones
      const newQuote = await fetchQuoteById(quoteDataResult.id);
      
      // 8. Actualizar el estado local
      if (newQuote) {
        setQuotes(prev => [newQuote, ...prev]);
      }

      return newQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cotización');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchQuoteById]);

  // Actualizar una cotización
  const updateQuote = useCallback(async (id: string, updates: UpdateQuoteRequest): Promise<ProductQuote | null> => {
    try {
      setLoading(true);
      setError(null);

      // 1. Actualizar cliente si se proporciona
      if (updates.client && updates.client.id) {
        const { error: clientError } = await supabase
          .from('client_quote_test')
          .update(updates.client)
          .eq('id', updates.client.id);

        if (clientError) throw clientError;
      }

      // 2. Actualizar empresa si se proporciona
      if (updates.company && updates.company.id) {
        const { error: companyError } = await supabase
          .from('company_quote_test')
          .update(updates.company)
          .eq('id', updates.company.id);

        if (companyError) throw companyError;
      }

      // 3. Actualizar items si se proporcionan
      if (updates.items) {
        // Eliminar items existentes
        const { error: deleteError } = await supabase
          .from('quote_items_test')
          .delete()
          .eq('quote_id', id);

        if (deleteError) throw deleteError;

        // Insertar nuevos items
        const itemsWithQuoteId = updates.items.map((item, index) => ({
          ...item,
          quote_id: id,
          item_order: index + 1
        }));

        const { error: itemsError } = await supabase
          .from('quote_items_test')
          .insert(itemsWithQuoteId);

        if (itemsError) throw itemsError;
      }

      // 4. Actualizar la cotización principal
      const updateData: Partial<ProductQuote> = {};
      if (updates.status) updateData.status = updates.status;
      if (updates.notes) updateData.notes = updates.notes;
      if (updates.terms_conditions) updateData.terms_conditions = updates.terms_conditions;

      if (Object.keys(updateData).length > 0) {
        const { error: quoteError } = await supabase
          .from('product_quote_test')
          .update(updateData)
          .eq('id', id);

        if (quoteError) throw quoteError;
      }

      // 5. Obtener la cotización actualizada
      const updatedQuote = await fetchQuoteById(id);
      
      // 6. Actualizar el estado local
      if (updatedQuote) {
        setQuotes(prev => prev.map(quote => 
          quote.id === id ? updatedQuote : quote
        ));
      }

      return updatedQuote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la cotización');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchQuoteById]);

  // Eliminar una cotización
  const deleteQuote = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('product_quote_test')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar el estado local
      setQuotes(prev => prev.filter(quote => quote.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la cotización');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cambiar estado de una cotización
  const updateQuoteStatus = useCallback(async (id: string, status: ProductQuote['status']): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('product_quote_test')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Actualizar el estado local
      setQuotes(prev => prev.map(quote => 
        quote.id === id ? { ...quote, status } : quote
      ));

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar cotizaciones
  const searchQuotes = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: searchError } = await supabase
        .from('product_quote_test')
        .select(`
          *,
          client:client_quote_test(*),
          company:company_quote_test(*),
          items:quote_items_test(*)
        `)
        .or(`quote_number.ilike.%${searchTerm}%,client.name.ilike.%${searchTerm}%,company.name.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (searchError) throw searchError;

      setQuotes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar cotizaciones al montar el componente
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    fetchQuoteById,
    createQuote,
    updateQuote,
    deleteQuote,
    updateQuoteStatus,
    searchQuotes,
    clearError: () => setError(null)
  };
};
