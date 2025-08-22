import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Edit, Filter, Package, Plus, Search, Trash2, X } from "lucide-react";

type ProductStatus = "Active" | "Low Stock" | "Out of Stock";

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    status: ProductStatus;
    brand: string;
    fitment: string;
    image: string;
    badge?: string;
};

const products: Product[] = [
    { 
        id: 1, 
        name: "Brake Pads", 
        price: 35.00, 
        stock: 25, 
        category: "Brake", 
        status: "Active",
        brand: "Bosch",
        fitment: "Toyota Corolla 2018-2022",
        image: "/images/brake-pads.jpg"
    },
    { 
        id: 2, 
        name: "Oil Filter", 
        price: 8.50, 
        stock: 50, 
        category: "Filters", 
        status: "Active",
        brand: "Mann",
        fitment: "Honda Civic 2019-2023",
        image: "/images/oil-filter.jpg"
    },
    { 
        id: 3, 
        name: "Air Filter", 
        price: 12.00, 
        stock: 30, 
        category: "Filters", 
        status: "Active",
        brand: "K&N",
        fitment: "Ford Focus 2020-2024",
        image: "/images/air-filter.jpg"
    },
    { 
        id: 4, 
        name: "Spark Plugs", 
        price: 15.00, 
        stock: 40, 
        category: "Engine", 
        status: "Active",
        brand: "NGK",
        fitment: "Volkswagen Golf 2018-2022",
        image: "/images/spark-plugs.jpg"
    },
    { 
        id: 5, 
        name: "Spark Plugs", 
        price: 15.00, 
        stock: 40, 
        category: "Engine", 
        status: "Active",
        brand: "NGK",
        fitment: "Volkswagen Golf 2018-2022",
        image: "/images/spark-plugs.jpg"
    },
    { 
        id: 6, 
        name: "Spark Plugs", 
        price: 15.00, 
        stock: 40, 
        category: "Engine", 
        status: "Active",
        brand: "NGK",
        fitment: "Volkswagen Golf 2018-2022",
        image: "/images/spark-plugs.jpg"
    }
];

const categories = [
    { name: "Oil Filters", icon: "🛢️" },
    { name: "Brake Pads", icon: "🛑" },
    { name: "Air Filters", icon: "💨" },
    { name: "Brake Shoes", icon: "👞" },
    { name: "Bike Tires", icon: "🚲" },
    { name: "Clutch Kits", icon: "⚙️" },
    { name: "Spark Plugs", icon: "⚡" },
    { name: "Car Mirrors", icon: "🪞" }
];

const getBadgeVariantForStatus = (status: ProductStatus): React.ComponentProps<typeof Badge>['variant'] => {
    switch (status) {
        case "Active":
            return "default";
        case "Low Stock":
            return "secondary";
        case "Out of Stock":
            return "destructive";
    }
};

export const CatalogPage = () => (
    <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
            </Button>
        </div>

        {/* Search Bar with Filter Button */}
        <div className="flex gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
            </div>
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white text-xs">⚏</span>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-96">
                    <SheetHeader>
                        <SheetTitle>Filtros de Productos</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <FilterSidebar />
                    </div>
                </SheetContent>
            </Sheet>
        </div>

        {/* Product Categories */}
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Product Category</h2>
                <a href="#" className="text-red-500 text-sm">See all</a>
            </div>
            <div className="grid grid-cols-8 gap-4 w-full">
                {categories.map((category, index) => (
                    <div key={index} className="text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl">{category.icon}</span>
                        </div>
                        <p className="text-xs text-gray-600">{category.name}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Recommended Products */}
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Recommend for you</h2>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="multiple-selection" />
                        <Label htmlFor="multiple-selection">Multiple Selection</Label>
                    </div>
                    <a href="#" className="text-red-500 text-sm">See all</a>
                </div>
            </div>
            <div className="flex gap-4 overflow-x-auto w-full">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>

        {/* Top Selling Products */}
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Top-Selling Product</h2>
                <a href="#" className="text-red-500 text-sm">See all</a>
            </div>
            <div className="flex gap-4 overflow-x-auto w-full">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} showTopSellerBadge />
                ))}
            </div>
        </div>
    </div>
);

const ProductCard = ({ product, showTopSellerBadge = false }: { product: Product; showTopSellerBadge?: boolean }) => (
    <Card className="w-64 flex-shrink-0">
        <CardContent className="p-0">
            <div className="relative">
                <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                </div>
                {showTopSellerBadge && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                        Top Selling
                    </Badge>
                )}
                <div className="absolute bottom-2 right-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button size="sm" className="w-8 h-8 p-0 bg-red-500 hover:bg-red-600">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-96">
                            <SheetHeader>
                                <SheetTitle>{product.name}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Brand</Label>
                                    <Input value={product.brand} readOnly className="bg-gray-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="brake">Brake</SelectItem>
                                            <SelectItem value="filters">Filters</SelectItem>
                                            <SelectItem value="engine">Engine</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Base Price</Label>
                                    <Input value={`$${product.price.toFixed(2)}`} readOnly className="bg-gray-100" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Selling Price</Label>
                                    <Input value={`$${(product.price * 1.3).toFixed(2)}`} className="text-red-500 font-semibold" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Badge</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Badge" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="top-seller">Top Seller</SelectItem>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="sale">Sale</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select defaultValue="active">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button className="w-full bg-red-500 hover:bg-red-600 mt-6">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add to My Store
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-xs">In Stock</Badge>
                    <span className="font-semibold text-red-500">${product.price.toFixed(2)}</span>
                </div>
                <h3 className="font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-1">Brand: {product.brand}</p>
                <p className="text-sm text-gray-600">Fits: {product.fitment}</p>
            </div>
        </CardContent>
    </Card>
);

const FilterSidebar = () => (
    <div className="space-y-6">
        {/* Category */}
        <div>
            <h4 className="font-medium mb-3">Category</h4>
            <div className="flex flex-wrap gap-2">
                {["Suspension", "Brake", "Exhaust", "Engine", "Body", "Interior"].map((cat) => (
                    <button
                        key={cat}
                        className={`px-3 py-1 rounded text-sm ${
                            cat === "Brake" 
                                ? "bg-black text-white" 
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Brand */}
        <div>
            <h4 className="font-medium mb-3">Brand</h4>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search Brand" className="pl-10" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">↕</span>
                </div>
            </div>
        </div>

        {/* Supplier */}
        <div>
            <h4 className="font-medium mb-3">Supplier</h4>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="supplier1">Supplier 1</SelectItem>
                    <SelectItem value="supplier2">Supplier 2</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Parts Type */}
        <div>
            <h4 className="font-medium mb-3">Parts Type</h4>
            <div className="grid grid-cols-2 gap-2">
                {["Break Shoes", "Brake Pads", "Brake Rotors", "Brake Fluid", "Brake Calipers", "Brake Lines"].map((part) => (
                    <div key={part} className="flex items-center space-x-2">
                        <Checkbox id={part} />
                        <Label htmlFor={part} className="text-sm">{part}</Label>
                    </div>
                ))}
            </div>
        </div>

        {/* Model */}
        <div>
            <h4 className="font-medium mb-3">Model</h4>
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="corolla">Toyota Corolla</SelectItem>
                    <SelectItem value="civic">Honda Civic</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Year Range */}
        <div>
            <h4 className="font-medium mb-3">Year</h4>
            <div className="grid grid-cols-2 gap-2">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2015">2015</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Price Range */}
        <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <Slider defaultValue={[120, 200]} max={500} step={10} className="mb-2" />
            <div className="flex justify-between text-sm text-gray-600">
                <span>$120</span>
                <span>$200</span>
            </div>
        </div>

        {/* In Stock */}
        <div>
            <div className="flex items-center justify-between">
                <h4 className="font-medium">In Stock</h4>
                <Switch defaultChecked />
            </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
            <button className="text-red-500 text-sm">Reset</button>
            <Button className="bg-red-500 hover:bg-red-600">Apply Filters</Button>
        </div>
    </div>
);