import { Waves, Building2, TreePine, Home } from 'lucide-react';

interface CategoriesProps {
    dataCategory: string;
    setCategory: (category: string) => void;
}

const categories = [
    { label: 'Beach', value: 'Beach', icon: Waves },
    { label: 'Villas', value: 'Villas', icon: Building2 },
    { label: 'Cabins', value: 'Cabins', icon: TreePine },
    { label: 'Tiny homes', value: 'Tiny homes', icon: Home },
];

const Categories: React.FC<CategoriesProps> = ({ dataCategory, setCategory }) => {
    return (
        <div className="pt-3 cursor-pointer pb-6 flex items-center space-x-12">
            {categories.map(({ label, value, icon: Icon }) => (
                <div
                    key={value}
                    onClick={() => setCategory(value)}
                    className={`pb-4 flex flex-col items-center space-y-2 border-b-2 ${
                        dataCategory === value ? 'border-gray-800 opacity-100' : 'border-white opacity-60'
                    } hover:border-gray-200 hover:opacity-100 transition-all`}
                >
                    <Icon size={20} strokeWidth={1.5} />
                    <span className="text-xs">{label}</span>
                </div>
            ))}
        </div>
    );
};

export default Categories;