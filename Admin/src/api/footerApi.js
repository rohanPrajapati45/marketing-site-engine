import api from "../utils/api";

export const getFooterSettings = async () => {
  const res = await api.get("/api/footer");
  return res.data;
};

export const updateCopyrightText = async (copyrightText, showLogo) => {
  const res = await api.put("/api/footer/copyright", { copyrightText, showLogo });
  return res.data;
};

export const addSocialLink = async (linkData) => {
  const res = await api.post("/api/footer/social", linkData);
  return res.data;
};

export const updateSocialLink = async (id, linkData) => {
  const res = await api.put(`/api/footer/social/${id}`, linkData);
  return res.data;
};

export const deleteSocialLink = async (id) => {
  const res = await api.delete(`/api/footer/social/${id}`);
  return res.data;
};

export const reorderSocialLinks = async (orderedIds) => {
  const res = await api.put("/api/footer/social/reorder", { orderedIds });
  return res.data;
};
