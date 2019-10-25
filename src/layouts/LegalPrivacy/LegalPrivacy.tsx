import React from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar from '../Navbar/Navbar';
import Legalmattic from '../../components/Legalmattic/Legalmattic';

export default function PrivacyPolicy() {
  return (
    <React.Fragment>
      <Navbar />
      <div className="legal-container">
        <div>
          <div className="heading-2">Privacy Policy</div>
          <i> Last updated: August 17th, 2019 </i>
          <Legalmattic />
        </div>

        <div>
          Please read this Privacy Policy carefully before using
          https://coverstory.page ("us", "we", "our", the "Site", or the
          "Service"). We are committed to ensuring the privacy of your
          information. This page informs you of our policies regarding the
          collection, use and disclosure of Personal Information we receive from
          users of the Site. We use your Personal Information only for providing
          and improving the Site. By using the Site, you agree to the collection
          and use of information in accordance with this policy.
        </div>

        <div>
          <div className="heading-2 faded">
            1. Information Collection And Use
          </div>
          While using our Site, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you. Personally identifiable information may include, but is
          not limited to your name ("Personal Information").
        </div>

        <div>
          <div className="heading-2 faded"> 2. Log Data </div>
          Like many site operators, we collect information that your browser
          sends whenever you visit our Site ("Log Data"). This Log Data may
          include information such as your computer's Internet Protocol ("IP")
          address, browser type, browser version, the pages of our Site that you
          visit, the time and date of your visit, the time spent on those pages
          and other statistics. In addition, we may use third party services
          such as Google Analytics that collect, monitor and analyze this data.
        </div>

        <div>
          <div className="heading-2 faded"> 3. Communications </div>
          We may use your Personal Information to contact you with newsletters,
          marketing or promotional materials and other information.
        </div>

        <div>
          <div className="heading-2 faded"> 4. Cookies </div>
          Cookies are files with small amount of data, which may include an
          anonymous unique identifier. Cookies are sent to your browser from a
          web site and stored on your computer's hard drive. Like many sites, we
          use "cookies" to collect information. You can instruct your browser to
          refuse all cookies or to indicate when a cookie is being sent.
          However, if you do not accept cookies, you may not be able to use some
          portions of our Site.
        </div>

        <div>
          <div className="heading-2 faded"> 5. Security</div>
          The security of your Personal Information is important to us, but
          remember that no method of transmission over the Internet, or method
          of electronic storage, is 100% secure. While we strive to use
          commercially acceptable means to protect your Personal Information, we
          cannot guarantee its absolute security.
        </div>

        <div>
          <div className="heading-2 faded"> 6. Transferring Information</div>
          Because our Services are offered worldwide, the information about you
          that we process when you use the Services in the EU may be used,
          stored, and/or accessed by individuals operating outside the European
          Economic Area (EEA) who work for us, other members of our group of
          companies, or third party data processors. When providing information
          about you to entities outside the EEA, we will take appropriate
          measures to ensure that the recipient protects your personal
          information adequately in accordance with this Privacy Policy as
          required by applicable law.
        </div>

        <div>
          <div className="heading-2 faded">
            6. Changes To This Privacy Policy
          </div>
          This Privacy Policy is effective as of August 17th, 2019 and will
          remain in effect except with respect to any changes in its provisions
          in the future, which will be in effect immediately after being posted
          on this page. We reserve the right to update or change our Privacy
          Policy at any time and you should check this Privacy Policy
          periodically. Your continued use of the Service after we post any
          modifications to the Privacy Policy on this page will constitute your
          acknowledgment of the modifications and your consent to abide and be
          bound by the modified Privacy Policy. If we make any material changes
          to this Privacy Policy, we will notify you either through the email
          address you have provided us, or by placing a prominent notice on our
          website.
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
}
