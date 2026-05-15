import mongoose from 'mongoose';

// ── PAGE HEADER — top white section of solutions page ──
// Only ONE document needed — single page header
const solutionsHeaderSchema = new mongoose.Schema(
  {
    // Maps to:
    // <h1 className="page-header-heading">
    //   <strong>{solutionsHeaderData.heading}</strong>
    // </h1>
    heading: {
      type: String,
      required: true,
      default: 'Some Ready Solutions for your Business',
      trim: true,
    },

    // Maps to:
    // <p className="page-header-subtext">
    //   {solutionsHeaderData.subtext}
    // </p>
    subtext: {
      type: String,
      required: true,
      default:
        'We help clients solve business problems by fusing creativity, innovation, strategy, and craft.',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SolutionsHeader', solutionsHeaderSchema);