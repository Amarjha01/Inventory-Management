import { useState } from "react";

import DashboardLayout from "../../../layouts/DashboardLayout";

import PageHeader from "../../../components/shared/ui/PageHeader";
import Button from "../../../components/shared/ui/Button";

import KitchenInfo from "../../../components/kitchen/requirement/KitchenInfo";
import ItemCard from "../../../components/kitchen/requirement/ItemCard";
import ItemSelectorModal from "../../../components/kitchen/requirement/ItemSelectorModal";

import { FiPlus } from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { createRequirement } from "../../../services/requirement.service";
import { storage } from "../../../utils/storage";
const NewRequirement = () => {

    const [selectedItems, setSelectedItems] = useState([]);

    const [remarks, setRemarks] = useState("");

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const user = storage.getUser();

    const addItem = (item) => {

        const exists = selectedItems.find(
            i => i.id === item.id
        );

        if (exists) return;

        setSelectedItems(prev => [
            ...prev,
            {
                ...item,
                requestedQuantity: 1,
            },
        ]);

    };

    const updateQuantity = (id, requestedQuantity) => {

        setSelectedItems(prev =>

            prev.map(item =>

                item.id === id

                    ? {
                        ...item,
                        requestedQuantity,
                    }

                    : item

            )

        );

    };

    const removeItem = (id) => {

        setSelectedItems(prev =>

            prev.filter(item => item.id !== id)

        );

    };

    const handleSubmit = async () => {

    if (selectedItems.length === 0) {
        alert("Please select at least one item.");
        return;
    }

    const payload = {

         kitchen: user.kitchen.name,
            createdBy: user.name,

        remarks,

        items: selectedItems.map(item => ({

            id: item.id,

            name: item.name,

            hindiName: item.hindiName,

            image: item.image,

            requestedQuantity: item.requestedQuantity,

            unit: item.unit,

        })),

    };

    try {

        const requirement = await createRequirement(payload);

        console.log(requirement);

        navigate(`/requirements/${requirement.id}`);

    }

    catch (err) {

        console.error(err);

    }

};

    return (

        <DashboardLayout>

            <PageHeader
                title="New Requirement"
                subtitle="Create material requirement"
            />

            <KitchenInfo />

            <div className="mt-6">

                <Button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2"
                >

                    <FiPlus />

                    Add Item

                </Button>

            </div>

            <div className="space-y-4 mt-6">

                {

                    selectedItems.length === 0

                        ? (

                            <div className="border-2 border-dashed rounded-2xl p-10 text-center text-gray-500">

                                No items selected

                            </div>

                        )

                        : (

                            selectedItems.map(item => (

                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={(qty) =>
                                        updateQuantity(item.id, qty)
                                    }
                                    onRemove={() =>
                                        removeItem(item.id)
                                    }
                                />

                            ))

                        )

                }

            </div>

            <div className="mt-6">

                <label className="font-medium block mb-2">

                    Remarks

                </label>

                <textarea
                    rows={4}
                    value={remarks}
                    onChange={(e) =>
                        setRemarks(e.target.value)
                    }
                    placeholder="Write remarks..."
                    className="w-full rounded-xl border p-3 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />

            </div>

            <div className="mt-8">

                <Button
                    onClick={handleSubmit}
                >

                    Submit Requirement

                </Button>

            </div>

            <ItemSelectorModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onSelect={addItem}
                selectedItems={selectedItems}
            />

        </DashboardLayout>

    );

};

export default NewRequirement;