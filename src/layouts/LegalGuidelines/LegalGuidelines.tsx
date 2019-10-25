import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Legalmattic from '../../components/Legalmattic/Legalmattic';

export default function UserGuidelines() {
  return (
    <React.Fragment>
      <Navbar />
      <div className="legal-container">
        <div>
          <div className="heading-2">User Guidelines</div>
          <i> Last updated: August 17th, 2019 </i>
          <Legalmattic />
        </div>

        <div>
          <div className="heading-2 faded">Illegal content and conduct.</div>
          Self-explanatory.
        </div>

        <div>
          <div className="heading-2 faded">
            Intellectual property infringement.
          </div>
          https://coverstory.page is a publishing, rather than a file sharing
          platform, so we recognize that copyrighted materials are often used in
          fair use context. We strongly support this and urge copyright holders
          to take this into consideration before submitting complaints. If
          you're not sure, a good rule of thumb is to always ask the rights
          holder for permission before republishing their content.
        </div>

        <div>
          <div className="heading-2 faded">Pornography.</div>
          We know that there may be different definitions of this, but
          generally, we define pornography as visual depictions of sexually
          explicit acts.
        </div>

        <div>
          <div className="heading-2 faded">
            Technologically harmful content.
          </div>
          Please don’t upload or link to malware, spyware, adware, or other
          malicious or destructive code.
        </div>

        <div>
          <div className="heading-2 faded">Impersonation.</div>
          Don’t claim to be a person or organization you’re not. (Parody and
          satire are ok though!)
        </div>

        <div>
          <div className="heading-2 faded">Directly threatening material.</div>
          Do not post direct and realistic threats of violence. That is, you
          cannot post a genuine call for violence—or death—against an individual
          person, or groups of persons. This doesn't mean that we'll remove all
          hyperbole or offensive language.
        </div>

        <div>
          <div className="heading-2 faded">Posting private information.</div>
          Don’t share someone’s personal information without their consent.
        </div>

        <div>
          <div className="heading-2 faded">Advertising.</div>Advertising isn’t
          permitted.
        </div>

        <div>
          <div className="heading-2 faded">
            Spam or machine-generated content.
          </div>
          You know what this is, but in general, sites such as those primarily
          dedicated to drive traffic to third party sites, boost SEO, phish,
          spoof, or promote affiliate marketing aren’t cool.
        </div>

        <div>
          <div className="heading-2 faded">Other Notes</div>
          Bear in mind that these are just guidelines -- interpretations are
          solely up to us. These guidelines are not exhaustive and are subject
          to change.
        </div>
      </div>

      <Footer />
    </React.Fragment>
  );
}
