import React from "react";
import { FiFileText, FiBookOpen, FiShoppingBag, FiDownload } from "react-icons/fi";

import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import PageHeader from "../../../components/shared/ui/PageHeader";
import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";
import { themes } from "../../../components/shared/ui/Theme";

const Downloads = () => {
  const sections = [
    {
      title: "Gate In Pass",
      description:
        "Download and manage gate-in pass documents for incoming deliveries.",
      icon: FiFileText,
      color: "bg-[#168A5B]",
      lightColor: "bg-[#DDF5E9]",
      iconColor: "text-[#0F6B47]",
    },
    {
      title: "Day Book",
      description:
        "Download daily records and transaction details from the day book.",
      icon: FiBookOpen,
      color: "bg-[#22A06B]",
      lightColor: "bg-[#E8F6F0]",
      iconColor: "text-[#168A5B]",
    },
    {
      title: "Purchase Bill",
      description:
        "Download purchase bills and related procurement documents.",
      icon: FiShoppingBag,
      color: "bg-[#0F6B47]",
      lightColor: "bg-[#DDF5E9]",
      iconColor: "text-[#0F6B47]",
    },
  ];

  return (
    <ThemeProvider
      theme={themes.DOWNLOADS}
      className="min-h-full pb-24"
    >
      <div className="min-h-full bg-[#F3FAF7]">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <PageHeader
          title="Downloads"
          subtitle="Access and download your documents"
          imageUrl="/ui/DOWNLOADS.png"
        />

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* =================================================
                INTRO
            ================================================= */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#172B24]">
                Documents
              </h2>

              <p className="mt-1 text-sm text-[#66756F]">
                Select a document category to view or download
                available records.
              </p>
            </div>

            {/* =================================================
                DOCUMENT CARDS
            ================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <Card
                    key={section.title}
                    className="
                      group
                      relative
                      overflow-hidden
                      border
                      border-[#D5E9DF]
                      bg-white
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-lg
                      hover:border-[#35A96F]
                    "
                  >
                    {/* Top accent */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 ${section.color}`}
                    />

                    <div className="p-5 sm:p-6">
                      {/* Icon */}
                      <div
                        className={`
                          w-14
                          h-14
                          rounded-2xl
                          ${section.lightColor}
                          flex
                          items-center
                          justify-center
                          mb-5
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        `}
                      >
                        <Icon
                          size={28}
                          className={section.iconColor}
                        />
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-lg font-semibold text-[#172B24]">
                          {section.title}
                        </h3>

                        <p className="mt-2 min-h-[48px] text-sm leading-6 text-[#66756F]">
                          {section.description}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="mt-6 pt-4 border-t border-[#D5E9DF]">
                        <Button
                          className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            !bg-[#168A5B]
                            hover:!bg-[#0F6B47]
                            !text-white
                          "
                        >
                          <FiDownload size={16} />
                          View Downloads
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* =================================================
                INFO SECTION
            ================================================= */}
            <div className="mt-6">
              <div
                className="
                  rounded-2xl
                  border
                  border-[#D5E9DF]
                  bg-[#E8F6F0]
                  p-4
                  sm:p-5
                  flex
                  flex-col
                  sm:flex-row
                  items-start
                  sm:items-center
                  gap-4
                "
              >
                <div
                  className="
                    shrink-0
                    w-10
                    h-10
                    rounded-xl
                    bg-[#168A5B]
                    flex
                    items-center
                    justify-center
                    text-white
                  "
                >
                  <FiDownload size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#172B24]">
                    Download Center
                  </p>

                  <p className="text-sm text-[#66756F] mt-0.5">
                    All your generated documents are organized here
                    for quick access and download.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Downloads;
