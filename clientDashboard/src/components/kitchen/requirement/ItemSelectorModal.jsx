import { useMemo, useState } from "react";
import { MdClose, MdSearch, MdCheckCircle, MdCancel } from "react-icons/md";

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

      const keyword = search.toLowerCase().trim();

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
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-end
        justify-center
        bg-black/45
        backdrop-blur-[2px]

        sm:items-center
        sm:p-4
      "
    >
      {/* ================= MODAL ================= */}
      <div
        className="
          flex
          w-full
          flex-col
          overflow-hidden
          rounded-t-[22px]
          bg-white
          shadow-[0_-8px_40px_rgba(0,0,0,0.18)]

          h-[88vh]

          sm:h-auto
          sm:max-h-[85vh]
          sm:max-w-lg
          sm:rounded-2xl
        "
      >
        {/* ================= HEADER ================= */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-100
            px-4
            py-3

            sm:px-5
            sm:py-4
          "
        >
          <div>
            <h2 className="text-[16px] font-bold text-[#17213b] sm:text-lg">
              Select Item
            </h2>

            <p className="mt-0.5 text-[10px] text-gray-500 sm:text-xs">
              Choose an item to add to your requirement
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-500
              transition
              hover:bg-gray-200
              hover:text-gray-800
            "
          >
            <MdClose size={19} />
          </button>
        </div>

        {/* ================= SEARCH ================= */}
        <div
          className="
            shrink-0
            border-b
            border-gray-100
            bg-[#fafaff]
            px-4
            py-3

            sm:px-5
          "
        >
          <div className="relative">
            <MdSearch
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
              size={19}
            />

            <input
              type="text"
              placeholder="Search item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                h-10
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                py-2
                pl-9
                pr-3
                text-[13px]
                text-gray-800
                outline-none
                transition
                placeholder:text-gray-400
                focus:border-[#7657e8]
                focus:ring-2
                focus:ring-[#7657e8]/10
              "
            />
          </div>
        </div>

        {/* ================= ITEMS ================= */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-3
            py-3

            sm:px-4
            sm:py-4
          "
        >
          {/* Result count */}
          {filteredItems.length > 0 && (
            <div className="mb-2 px-1">
              <p className="text-[10px] font-medium text-gray-400">
                {filteredItems.length} item
                {filteredItems.length !== 1 ? "s" : ""} available
              </p>
            </div>
          )}

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div
              className="
                flex
                min-h-[180px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-gray-200
                bg-gray-50
                px-4
                text-center
              "
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <MdSearch size={21} className="text-gray-400" />
              </div>

              <p className="text-[13px] font-semibold text-gray-600">
                No item found
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                Try searching with another name
              </p>
            </div>
          )}

          {/* Item list */}
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <button
                key={item._id}
                type="button"
                disabled={!item.isActive}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className={`
                  group
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  border
                  p-2
                  text-left
                  transition-all

                  ${
                    item.isActive
                      ? "border-gray-400 bg-white hover:border-[#a78bfa] hover:bg-[#faf8ff] active:scale-[0.99]"
                      : "cursor-not-allowed border-gray-400 bg-gray-100 opacity-60"
                  }
                `}
              >
                {/* Image */}
                <div
                  className={`
                    relative
                    h-[52px]
                    w-[52px]
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    border
                    ${
                      item.isActive
                        ? "border-gray-100 bg-gray-50"
                        : "border-gray-200 grayscale"
                    }
                  `}
                >
                  <img
                    src={`/items/${item.image}`}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[13px] font-bold leading-tight text-[#17213b]">
                    {item.name}
                  </h3>

                  <p className="mt-0.5 truncate text-[10px] text-gray-500">
                    {item.hindiName}
                  </p>

                  {/* Availability */}
                  <div className="mt-1 flex items-center gap-1">
                    {item.isActive ? (
                      <>
                        <MdCheckCircle size={13} className="text-green-500" />

                        <span className="text-[10px] font-semibold text-green-600">
                          Available
                        </span>
                      </>
                    ) : (
                      <>
                        <MdCancel size={13} className="text-red-500" />

                        <span className="text-[10px] font-semibold text-red-500">
                          Not Available
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Add indicator */}
                {item.isActive && (
                  <div
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f1eaff]
                      text-[#6337e8]
                      opacity-0
                      transition
                      group-hover:opacity-100
                    "
                  >
                    <span className="text-[17px] leading-none">+</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MOBILE FOOTER ================= */}
        <div
          className="
            shrink-0
            border-t
            border-gray-100
            bg-white
            px-4
            py-2.5
            sm:hidden
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              h-9
              w-full
              rounded-lg
              bg-gray-100
              text-[12px]
              font-semibold
              text-gray-600
              transition
              active:bg-gray-200
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemSelectorModal;
