import { useMemo, useState } from "react";

import { MdClose, MdSearch } from "react-icons/md";

const ItemSelectorModal = ({
  open,

  onClose,

  items = [],

  selectedItems = [],

  onSelect,
}) => {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const alreadySelected = selectedItems.some(
        (selected) => selected._id === item._id,
      );

      if (alreadySelected) {
        return false;
      }

      const keyword = search.toLowerCase();

      return (
        item.name.toLowerCase().includes(keyword) ||
        item.hindiName.toLowerCase().includes(keyword)
      );
    });
  }, [items, selectedItems, search]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Select Item</h2>

          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-5">
          <div className="relative">
            <MdSearch
              className="absolute left-3 top-3.5 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl py-3 pl-10 pr-4 outline-none"
            />
          </div>
        </div>

        <div className="max-h-[450px] overflow-y-auto px-5 pb-5 space-y-3">
          {filteredItems.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No item found.
            </div>
          )}

          {filteredItems.map((item) => (
            <button
              key={item._id}
              onClick={() => {
                onSelect(item);

                onClose();
              }}
              className="w-full border rounded-xl p-3 flex items-center gap-4 hover:border-teal-500 transition"
            >
              <img
                src={`/items/${item.image}`}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover border"
              />

              <div className="flex-1 text-left">
                <h3 className="font-semibold">{item.name}</h3>

                <p className="text-sm text-gray-500">{item.hindiName}</p>

                <p className="text-sm mt-1">
                  Available : {item.quantity} {item.unit}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItemSelectorModal;
