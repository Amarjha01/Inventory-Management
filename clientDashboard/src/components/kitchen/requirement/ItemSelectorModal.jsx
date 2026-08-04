import { useMemo, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import items from "../../../mock/items";

const ItemSelectorModal = ({
    open,
    onClose,
    onSelect,
    selectedItems = [],
}) => {

    const [search, setSearch] = useState("");

    const selectedIds = selectedItems.map(item => item.id);

    const filteredItems = useMemo(() => {

        return items.filter(item => {

            const matchesSearch =
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.hindiName.includes(search);

            const notSelected = !selectedIds.includes(item.id);

            return matchesSearch && notSelected;

        });

    }, [search, selectedItems]);

    if (!open) return null;

    return (

        <>

            {/* Backdrop */}

            <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={onClose}
            />

            {/* Bottom Sheet */}

            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-5 max-h-[80vh]">

                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-semibold">
                        Add Item
                    </h2>

                    <button
                        onClick={onClose}
                    >
                        <FiX size={24} />
                    </button>

                </div>

                {/* Search */}

                <div className="mt-5 relative">

                    <FiSearch
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search item..."
                        className="w-full border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />

                </div>

                {/* Items */}

                <div className="mt-5 space-y-3 overflow-y-auto max-h-[55vh]">

                    {

                        filteredItems.length === 0 && (

                            <div className="text-center text-gray-500 py-8">

                                No items found

                            </div>

                        )

                    }

                    {

                        filteredItems.map(item => (

                            <button
                                key={item.id}
                                onClick={() => {

                                    onSelect(item);

                                    setSearch("");

                                    onClose();

                                }}
                                className="w-full flex items-center gap-4 border rounded-xl p-3 hover:bg-gray-50 transition"
                            >

                                <img
                                    src={`/items/${item.image}`}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-xl object-cover"
                                />

                                <div className="text-left">

                                    <p className="font-semibold">

                                        {item.name}

                                    </p>

                                    <p className="text-gray-500 text-sm">

                                        {item.hindiName}

                                    </p>

                                </div>

                            </button>

                        ))

                    }

                </div>

            </div>

        </>

    );

};

export default ItemSelectorModal;