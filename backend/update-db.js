import mongoose from 'mongoose';

async function update() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mse');
    console.log('DB connected.');

    const Section = mongoose.model('Section', new mongoose.Schema({
      page: mongoose.Schema.Types.ObjectId,
      type: String,
      order: Number,
      data: Object
    }));

    // Update OMT to use logo2.png and page2.webp
    const res1 = await Section.updateOne(
      { _id: '6a0ab516207754e239f29399' },
      {
        $set: {
          'data.clientLogo': '/images/logos/logo2.png',
          'data.mockupImage': '/images/page2.webp'
        }
      }
    );
    console.log('Update OMT:', res1);

    // Update Zain to use logo3.png and page3.jpg
    const res2 = await Section.updateOne(
      { _id: '6a0ab520207754e239f2939a' },
      {
        $set: {
          'data.clientLogo': '/images/logos/logo3.png',
          'data.mockupImage': '/images/page3.jpg',
          'data.clientLogoAlt': 'Zain',
          'data.mockupAlt': 'Zain App Mockup'
        }
      }
    );
    console.log('Update Zain:', res2);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

update();
