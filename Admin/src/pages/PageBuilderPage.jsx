import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchSinglePage } from "../redux/slices/pageSlice";
import {
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from "../redux/slices/sectionSlice";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import SectionCard from "../components/SectionCard";
import AddSectionModal from "../components/AddSectionModal";
import EditSectionModal from "../components/EditSectionModal";
import CardFormModal from "../components/CardFormModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import toast from "react-hot-toast";

const PageBuilderPage = () => {
  const { pageId } = useParams();
  const dispatch = useDispatch();
  const { currentPage, loading } = useSelector((s) => s.pages);
  const [showAdd, setShowAdd] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [cardSection, setCardSection] = useState(null);
  const [movedSectionId, setMovedSectionId] = useState(null);

  useEffect(() => {
    dispatch(fetchSinglePage(pageId));
  }, [dispatch, pageId]);

  const sections =
    currentPage?.sections?.slice().sort((a, b) => a.order - b.order) || [];

  const handleAddSection = async (sectionData) => {
    const res = await dispatch(createSection({ pageId, sectionData }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Section added");
      setShowAdd(false);
    } else {
      toast.error(res.payload || "Failed to add section");
    }
  };

  const handleUpdateSection = async (sectionId, data) => {
    const res = await dispatch(updateSection({ sectionId, data }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Section updated");
      setEditSection(null);
    } else {
      toast.error(res.payload || "Failed to update");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    const res = await dispatch(deleteSection(sectionId));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Section deleted");
    } else {
      toast.error(res.payload || "Failed to delete section");
    }
  };

  const handleToggleEnabled = async (section) => {
    const res = await dispatch(
      updateSection({
        sectionId: section._id,
        data: { enabled: !section.enabled },
      }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(section.enabled ? "Section disabled" : "Section enabled");
    } else {
      toast.error(res.payload || "Failed to update section");
    }
  };

  const handleMove = async (index, direction) => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    const movedId = newSections[targetIndex]._id;
    const reorderPayload = newSections.map((s, i) => ({
      sectionId: s._id,
      order: i + 1,
    }));
    const res = await dispatch(
      reorderSections({ pageId, sections: reorderPayload }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      setMovedSectionId(movedId);
      setTimeout(() => setMovedSectionId(null), 1200);
      toast.success("Reordered");
    }
  };

  const handleCardsSave = async (sectionId, cards) => {
    const res = await dispatch(
      updateSection({ sectionId, data: { data: { cards } } }),
    );
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Cards updated");
      setCardSection(null);
    } else {
      toast.error(res.payload || "Failed to update cards");
    }
  };

  if (loading && !currentPage) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/pages"
          className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text-muted)] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {currentPage?.title || "Page Builder"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            /{currentPage?.slug} · {sections.length} sections
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-medium transition-colors text-sm shadow-lg shadow-[var(--accent)]/15"
        >
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {/* Sections list */}
      {sections.length === 0 ? (
        <EmptyState
          title="No sections yet"
          description="Start building your page by adding sections"
          action={() => setShowAdd(true)}
          actionLabel="Add Section"
        />
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <SectionCard
              key={section._id}
              section={section}
              index={index}
              total={sections.length}
              onEdit={() => setEditSection(section)}
              onDelete={() => setDeleteTarget(section)}
              onToggle={() => handleToggleEnabled(section)}
              onMoveUp={() => handleMove(index, "up")}
              onMoveDown={() => handleMove(index, "down")}
              onManageCards={() => setCardSection(section)}
              highlight={movedSectionId === section._id}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <AddSectionModal
          isOpen
          onClose={() => setShowAdd(false)}
          onSubmit={handleAddSection}
        />
      )}
      {editSection && (
        <EditSectionModal
          isOpen
          onClose={() => setEditSection(null)}
          section={editSection}
          onSubmit={(data) => handleUpdateSection(editSection._id, data)}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          isOpen
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteSection(deleteTarget._id)}
          title="Delete Section"
          message={`Delete "${deleteTarget.type}" section? This cannot be undone.`}
        />
      )}
      {cardSection && (
        <CardFormModal
          isOpen
          onClose={() => setCardSection(null)}
          section={cardSection}
          onSave={handleCardsSave}
        />
      )}
    </div>
  );
};

export default PageBuilderPage;
