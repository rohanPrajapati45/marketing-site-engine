import { useEffect, useRef } from 'react';
import SolutionSection from '../components/SolutionSection';

const solutionsHeaderData = {
  heading: 'Some Ready Solutions for your Business',
  subtext: 'We help clients solve business problems by fusing creativity, innovation, strategy, and craft.',
};

const solutionsData = [
  {
    id: 1,
    theme: 'dark',
    title: 'E-COMMERCE SOLUTIONS',
    description: 'As a full-service agency, we Build Custom eCommerce solutions in 4 WEEKS covering: Payment Gateway Integrations, Cash on Delivery, Delivery Service Integration, Stock Management and Customized eCommerce Features',
    inquiryLabel: 'For more inquiry fill the below',
    images: [
      '/images/solutions/ecom-1.jpg',
      '/images/solutions/ecom-2.jpg',
      '/images/solutions/ecom-3.jpg',
      '/images/solutions/ecom-4.jpg',
    ],
    tags: ['Stripe','MasterCard MPGS','VISA Cybersource','Aramex','DHL','PayTabs','Stock Integrations','Multi-Currency','Promo Codes','PayPal','Customized','Magento','Shopify','WooCommerce','Website','Native APPs','Track Your Order'],
    buttonText: 'Request Demo',
    buttonLink: '/contact',
  },
  {
    id: 2,
    theme: 'light',
    title: 'LOYALTY PROGRAM SOLUTIONS',
    description: 'We develop an end-2-end white label loyalty and marketing platform that allows businesses to acquire, understand, engage, and retain customers, whilst providing seamless reward experiences to customers.',
    inquiryLabel: 'For more inquiry fill the below',
    images: [
      '/images/solutions/loyalty-1.jpg',
      '/images/solutions/loyalty-2.jpg',
      '/images/solutions/loyalty-3.jpg',
      '/images/solutions/loyalty-4.jpg',
    ],
    tags: ['Redeem','Multi-Tiers','CashBack','Customized','WhiteLabel','Friendly','in-Store','POS','APIs Integrations','Campaigns Management','Marketing Rules'],
    buttonText: 'Request Demo',
    buttonLink: '/contact',
  },
  {
    id: 3,
    theme: 'dark',
    title: 'QSR: Quick Service Restaurant SOLUTIONS',
    description: 'Improve your speed of service and transform customer experience using our QSR Customized & Whitelabel Solution. Cloud-based Quick Service Restaurant Software helps you automate the entire delivery operations and increase profits.',
    inquiryLabel: 'For more inquiry fill the below',
    images: [
      '/images/solutions/qsr-1.jpg',
      '/images/solutions/qsr-2.jpg',
      '/images/solutions/qsr-3.jpg',
      '/images/solutions/qsr-4.jpg',
    ],
    tags: ['Delivery Integration','CRM Integration','Online Order','Multi-Restaurants','Track your Order','Collect Points','Customize your Order','Add-Ons','Vouchers','Online Payment','Cash on Delivery'],
    buttonText: 'Request Demo',
    buttonLink: '/contact',
  },
  {
    id: 4,
    theme: 'light',
    title: '"UBER-LIKE" SOLUTIONS',
    description: 'White Label Solution for any on-demand service. Whether it is a Taxi, Healthcare services, Food, Beauty or even a pet care... Customer APP - Service Provider APP - CMS - Operation System',
    inquiryLabel: 'For more inquiry fill the below',
    images: [
      '/images/solutions/uber-1.jpg',
      '/images/solutions/uber-2.jpg',
      '/images/solutions/uber-3.jpg',
      '/images/solutions/uber-4.jpg',
    ],
    tags: ['White Label','Customization','Scalable','In-App Chat','Analytics','Admin Portal','Automation','Integration','Online Payment','GeoLocation','Cloud Hosting','Live Tracking'],
    buttonText: 'Request Demo',
    buttonLink: '/contact',
  },
  {
    id: 5,
    theme: 'dark',
    title: 'CHATBOTS SOLUTIONS',
    description: 'Go beyond chatbots with Conversational AI. We build Smart AI Chatbot for your website or online store in 20 days. You can then convert up to 50% leads or sales from existing traffic.',
    inquiryLabel: 'For more inquiry fill the below',
    images: [
      '/images/solutions/chatbot-1.jpg',
      '/images/solutions/chatbot-2.jpg',
      '/images/solutions/chatbot-3.jpg',
      '/images/solutions/chatbot-4.jpg',
    ],
    tags: ['ChatBot','DialogFlow','Microsoft BotService','RASA','APIs SDK','Multi-Language','Customized','Integration','Machine Learning','NLP'],
    buttonText: 'Request Demo',
    buttonLink: '/contact',
  },
  {
    id: 6,
    theme: 'light',
    title: 'WORKFORCE EMPLOYEES SOLUTIONS',
    description: 'Big or small, every company needs a system for internal communication. We develop effective customized engagement Digital Solutions to Boost your Sales & Workforce, Make Employees more engaged, ability to Coordinate tasks between employees and departments.',
    inquiryLabel: 'For more inquiry fill the below',
    images: [
      '/images/solutions/workforce-1.jpg',
      '/images/solutions/workforce-2.jpg',
      '/images/solutions/workforce-3.jpg',
      '/images/solutions/workforce-4.jpg',
    ],
    tags: ['Intranet','Communication','Monitor Performance','Activities','Meetings','Memos','Surveys','Polls','Sales Agents','CarPooling','LeaderBoard','Gamification','Account Management'],
    buttonText: 'Request Demo',
    buttonLink: '/contact',
  },
  {
    id: 7,
    theme: 'dark',
    title: 'FINTECH SOLUTIONS',
    description: 'A fintech solution leverages technology to streamline and automate financial services, offering faster, more efficient transactions. It enables users to access payments, lending, and investment through digital platforms with blockchain and AI.',
    inquiryLabel: 'For more inquiry fill the below',
    images: [
      '/images/solutions/fintech-1.png',
      '/images/solutions/fintech-2.webp',
      '/images/solutions/fintech-3.webp',
     
    ],
    tags: ['Fintech','DigitalPayments','Blockchain','Crypto','RoboAdvisors','RegTech','OpenBanking','MobileBanking','Neobanking','DigitalWallets','FintechInnovation'],
    buttonText: 'Request Demo',
    buttonLink: '/contact',
  },
];

function Solutions() {
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .solutions-page {
          background: #fafafa;
          font-family: 'Exo', sans-serif;
          font-size: 15px;
          color: #212529;
        }

        /* ── PAGE HEADER — white section top of page ── */
        .page-header {
          background: white;
          padding-top: 100px;
          padding-bottom: 75px;
          width: 100%;
          box-sizing: border-box;
        }

        .page-header-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          box-sizing: border-box;
        }

        /* Left half only — matches col-lg-6 from original */
        .page-header-content {
          width: 100%;
          max-width: 50%;
        }

        /* Heading — bold, large, black */
        .page-header-heading {
          font-family: 'Exo', sans-serif;
          font-size: clamp(24px, 3vw, 40px);
          font-weight: 700;
          line-height: 1.2;

          color: #111;
          margin: 0 0 16px -130px;
        }

        /* Subtext paragraph */
        .page-header-subtext {
          font-family: 'Exo', sans-serif;
          font-size: 22px;
          font-weight: 400;
          line-height: 1.75;
          color: #212529;
          margin: 0 0 24px -130px;
          max-width: 560px;
        }

        /* Scroll reveal */
        .page-header-content {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .page-header-content.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 992px) {
          .page-header-content {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            padding-top: 80px;
            padding-bottom: 48px;
          }
          .page-header-container {
            padding: 0 20px;
          }
        }

        .solutions-footer-spacer {
          width: 100%;
          min-height: 140px;
          background: transparent;
        }
      `}</style>

      <div className="solutions-page">
        {/* ── PAGE HEADER ── */}
        <div className="page-header">
          <div className="page-header-container">
            <div className="page-header-content" ref={headerRef}>
              <h1 className="page-header-heading">
                <strong>{solutionsHeaderData.heading}</strong>
              </h1>

              <p className="page-header-subtext">
                {solutionsHeaderData.subtext}
              </p>
            </div>
          </div>
        </div>

        {/* More sections will be added below here */}
        {solutionsData.map((solution) => (
          <SolutionSection key={solution.id} solution={solution} />
        ))}

        <section className="solutions-footer-spacer" />
      </div>
    </>
  );
}

export default Solutions;
