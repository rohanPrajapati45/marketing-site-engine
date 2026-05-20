import React, { useState } from "react";
import Modal from "./ui/Modal";
import DynamicFormRenderer from "./DynamicFormRenderer";
import {
  getSectionFields,
  sectionTypeInfo,
  resolveCardType,
} from "../schemas/sectionSchemas";
import BlogManagementPanel from "./BlogManagementPanel";

const EditSectionModal = ({ isOpen, onClose, section, onSubmit }) => {
  const { cardType, cardId, cards, ...initialSectionData } = section.data || {};
  const [sectionData, setSectionData] = useState(initialSectionData);

  // Use getSectionFields to merge base + cardType extra fields
  const schema = getSectionFields(section.type, cardType);
  const info = sectionTypeInfo[section.type];
  const effectiveCardType = resolveCardType(section);

  if (section.type === "content-blog") {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Section" size="xl">
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
            <span className="text-xl">{info?.icon || "📄"}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {info?.label || section.type}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {info?.description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md font-medium">
                Order: {section.order}
              </span>
              <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-md font-medium">
                Blog Content
              </span>
            </div>
          </div>

          <BlogManagementPanel sectionId={section._id} />
        </div>
      </Modal>
    );
  }

  const handleSubmit = () => {
    onSubmit({
      data: { ...sectionData, ...(cardType ? { cardType, cardId } : {}) },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Section`}
      size={
        ["work-category-menu", "sticky-services"].includes(section.type)
          ? "xl"
          : "lg"
      }
    >
      <div className="space-y-5">
        {/* Section type info */}
        <div className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-xl border border-[var(--border)]">
          <span className="text-xl">{info?.icon || "📄"}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {info?.label || section.type}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              {info?.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md font-medium">
              Order: {section.order}
            </span>
            {effectiveCardType && (
              <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded-md font-medium">
                {effectiveCardType}
              </span>
            )}
          </div>
        </div>

        {schema.length > 0 ? (
          <DynamicFormRenderer
            schema={schema}
            data={sectionData}
            onChange={setSectionData}
          />
        ) : (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">
            No editable fields for this section type. Use card management for
            card-based content.
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--hover)] font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditSectionModal;
