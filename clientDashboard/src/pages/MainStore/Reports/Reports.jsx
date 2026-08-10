import { useEffect, useState } from "react";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import { getKitchens } from "../../../services/kitchen.service";
import { downloadRequirementReport } from "../../../services/report.service";

const Reports = () => {
  const [loading, setLoading] = useState(false);

  const [kitchens, setKitchens] = useState([]);

  const [filters, setFilters] = useState({
    date: new Date().toISOString().split("T")[0],

    kitchen: "",

    status: "",
  });

  useEffect(() => {
    loadKitchens();
  }, []);

  const loadKitchens = async () => {
    try {
      const data = await getKitchens();

      setKitchens(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,

      [e.target.name]: e.target.value,
    }));
  };

  const handleDownload = async () => {
    try {
      setLoading(true);

      const blob = await downloadRequirementReport(filters);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `Requirements-${filters.date}.xlsx`;

      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Unable to download report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold">Reports</h1>

        <p className="text-gray-500">Download Excel reports</p>
      </Card>

      <Card>
        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-2">Date</label>

            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Kitchen</label>

            <select
              name="kitchen"
              value={filters.kitchen}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            >
              <option value="">All Kitchens</option>

              {kitchens.map((kitchen) => (
                <option key={kitchen._id} value={kitchen._id}>
                  {kitchen.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Status</label>

            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            >
              <option value="">All</option>

              <option value="Submitted">Submitted</option>

              <option value="Out For Delivery">Out For Delivery</option>

              <option value="Received">Received</option>
            </select>
          </div>

          <Button
            className="w-full"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Generating Report..." : "Download Excel"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
