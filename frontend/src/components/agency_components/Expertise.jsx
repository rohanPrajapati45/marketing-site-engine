const certifications = [
  {
    link: "https://www.designrush.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/264234342.png",
  },

  {
    link: "https://sendgrid.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/436600237.png",
  },

  {
    link: "https://stripe.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/67477477.png",
  },

  {
    link: "https://reactnative.dev/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/183619392.png",
  },

  {
    link: "https://developers.google.com/ml-kit",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/920906950.png",
  },

  {
    link: "https://firebase.google.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/1984016222.png",
  },

  {
    link: "https://www.apple.com/apple-pay/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/910734131.png",
  },

  {
    link: "https://laravel.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/583730353.png",
  },

  {
    link: "https://www.oracle.com",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/1377190685.png",
  },

  {
    link: "https://www.salesforce.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/221629520.png",
  },

  {
    link: "https://mailchimp.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/2054804823.png",
  },

  {
    link: "https://onesignal.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/1845580431.png",
  },

  {
    link: "https://www.twilio.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/838583440.png",
  },

  {
    link: "https://github.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/1885738698.png",
  },

  {
    link: "https://www.adjust.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/1205789607.png",
  },

  {
    link: "https://analytics.google.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/735243488.png",
  },

  {
    link: "https://azure.microsoft.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/2073006633.png",
  },

  {
    link: "https://rasa.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/1514711069.png",
  },

  {
    link: "https://dialogflow.cloud.google.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/990380247.png",
  },

  {
    link: "https://woocommerce.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/568086696.png",
  },

  {
    link: "https://www.shopify.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/800391213.png",
  },

  {
    link: "https://magento.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/855533679.png",
  },

  {
    link: "https://nodejs.org/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/2142635058.png",
  },

  {
    link: "https://aws.amazon.com/",
    image:
      "https://tedmob-cop1-files.s3.amazonaws.com/tedmob.com/storage/certifications/1234293507.png",
  },
];

function Expertise({ section }) {
  const { title, subtitle, cards = [] } = section.data;

  return (
    <section
      className="
        w-full

        bg-[#F7F7F7]

        px-5
        sm:px-8
        lg:px-8

        py-10
        lg:py-14
      "
      style={{
        fontFamily: "Exo, sans-serif",
      }}
    >
      <div className="max-w-[1700px]">
        {/* HEADER */}

        <h2
          className="
            text-[38px]
            sm:text-[52px]
            lg:text-[72px]

            font-black

            leading-none
            tracking-[-3px]

            text-[#1E2329]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-6

            text-[15px]
            lg:text-[16px]

            font-[700]

            text-[#7A7A7A]
          "
        >
          {subtitle}
        </p>

        {/* LOGOS */}

        <ul
          className="
            mt-14

            grid

            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-6

            gap-x-10
            gap-y-14

            items-center
          "
        >
          {cards.map((item, index) => (
            <li
              key={index}
              className="
                flex
                items-center
                justify-center
              "
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full

                  flex
                  items-center
                  justify-center
                "
              >
                <img
                  src={item.image}
                  alt="Certification"
                  loading="lazy"
                  className="
                    w-full
                    h-auto

                    object-contain
                  "
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Expertise;
