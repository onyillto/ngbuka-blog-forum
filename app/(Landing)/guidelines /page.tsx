import React from "react";

const Guidelines = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b-4 border-purple-600 pb-4">
          COMMUNITY GUIDELINES
        </h1>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-8">
          <p className="text-gray-800 font-medium">
            Follow and read these guidelines to ensure a positive and respectful
            community experience.
          </p>
        </div>

        {/* Guideline 1 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">1.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Respect Others
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>You must treat every member with respect.</p>
            <p>
              You are strictly forbidden from insulting, harassing, or attacking
              others. Hate speech, bullying, or discrimination will not be
              tolerated.
            </p>
            <p>
              You are free to disagree with ideas, but you must do so
              respectfully and without attacking the person.
            </p>
          </div>
        </section>

        {/* Guideline 2 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">2.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Stay On Topic
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>
              You are expected to keep your discussions relevant to educational
              and informational topics only.
            </p>
            <p>
              You are forbidden from posting spam, irrelevant promotions, or
              repeated content.
            </p>
            <p>
              If you want to share off-topic material, you must confirm that it
              is appropriate for the space.
            </p>
          </div>
        </section>

        {/* Guideline 3 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">3.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Strict No-Soliciting Rule
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="mb-2">
                You are strictly prohibited from asking for money, donations, or
                financial help in this forum.
              </p>
              <p className="mb-2">
                You are not allowed to promote products or services unless you
                are authorized by the Admin.
              </p>
              <p className="mb-2">
                If you decide to assist another member privately, you do so
                entirely at your own risk. The Business/Admin will not be
                responsible for any outcome.
              </p>
            </div>
          </div>
        </section>

        {/* Guideline 4 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">4.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Share Accurate and Helpful Information
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>
              You must make every effort to post accurate, reliable, and useful
              information.
            </p>
            <p>
              You may not knowingly share false, misleading, or harmful content.
            </p>
          </div>
        </section>

        {/* Guideline 5 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">5.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Give Credit Where It&apos;s Due
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>You must respect intellectual property.</p>
            <p>
              If you share someone else&apos;s content, or use a part of someone&apos;s
              post, you are required to give proper credit to the author(s).
            </p>
            <p>You may not copy or reuse content without permission.</p>
          </div>
        </section>

        {/* Guideline 6 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">6.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Protect Privacy & Safety
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-3">
              <p className="mb-2">
                You may not post personal details such as phone numbers,
                addresses, ID numbers, bank details, or ATM credentials.
              </p>
            </div>
            <p>
              It is your own responsibility to protect your own login details
              and never share your password with others.
            </p>
            <p className="font-medium">
              Please note that the Business/Admin will never ask you for your
              banking or security details.
            </p>
          </div>
        </section>

        {/* Guideline 7 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">7.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              No Harmful or Illegal Content
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>
              You are strictly prohibited from posting violent, offensive,
              sexually explicit, or unlawful material.
            </p>
            <p>
              You are not allowed to promote self-harm, criminal activity, or
              dangerous behavior.
            </p>
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="font-medium">
                If you break this rule, your content will be removed, and you
                may be banned or face disciplinary actions as the case may be.
              </p>
            </div>
          </div>
        </section>

        {/* Guideline 8 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">8.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Intellectual Property
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>
              You may not post copyrighted or protected material unless you have
              been authorized to do so.
            </p>
            <p>
              You agree that content you create and post here remains yours, but
              you also grant the forum permission to display it.
            </p>
          </div>
        </section>

        {/* Guideline 9 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">9.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Reporting Problems
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>
              If you see harmful, offensive, or suspicious content, you are
              encouraged to report it to the Admin.
            </p>
            <p>
              You may not retaliate or argue publicly - let the Admin handle it.
            </p>
            <p>
              You have accepted that the Admin has your implied authority to
              remove, edit, or block content or users that break these rules.
            </p>
          </div>
        </section>

        {/* Guideline 10 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">10.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Disputes Between Members
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>
              If you have any disagreement, you must try to resolve it calmly.
            </p>
            <p>If needed, you may go through online mediation.</p>
            <p>
              You agree that the Business/Admin is not responsible for personal
              disputes.
            </p>
          </div>
        </section>

        {/* Guideline 11 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">11.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Quality of Participation
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>
              You are expected to contribute positively by writing clearly and
              adding value to discussions.
            </p>
            <p>
              You may not use offensive language, excessive slang, or all-caps
              writing.
            </p>
            <p>You should respect cultural and religious differences.</p>
          </div>
        </section>

        {/* Guideline 12 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">12.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Protecting Minors
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="mb-2">
                You are strictly prohibited from posting or sharing content that
                harms or endangers minors.
              </p>
              <p>
                If you are under 18, you may only use this platform under
                guidance from a parent, guardian, or teacher (as the law
                requires).
              </p>
            </div>
          </div>
        </section>

        {/* Guideline 13 */}
        <section className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">13.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Fraud & Scams
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>You must be alert and protect yourself from scams.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-3">
              <p className="mb-2 font-medium">
                Please note that the Business/Admin will never reach out to you
                first to ask for money, financial help, or private details.
              </p>
              <p className="mb-2">
                You agree to use only our official website for communication.
              </p>
              <p>
                If you deal with impostors or fake accounts, you accept that it
                is at your own risk, and the Business/Admin is not liable.
              </p>
            </div>
          </div>
        </section>

        {/* Guideline 14 */}
        <section className="mb-8">
          <div className="flex items-start mb-4">
            <span className="text-2xl font-bold text-purple-600 mr-3">14.</span>
            <h2 className="text-2xl font-semibold text-gray-800">
              Updates to Guidelines
            </h2>
          </div>
          <div className="ml-8 space-y-2 text-gray-700">
            <p>
              You accept that these guidelines may change from time to time.
            </p>
            <p>
              By continuing to use the forum, you agree to follow the most
              recent version.
            </p>
          </div>
        </section>

        {/* Enforcement Notice */}
        <div className="mt-12 pt-6 border-t-2 border-purple-200">
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-purple-800 mb-3">
              Enforcement & Consequences
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Violation of these guidelines may result in:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Warning or temporary suspension</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Content removal or editing</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Permanent ban from the forum</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                <span>Legal action in cases of serious violations</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-2">
            By using this forum, you agree to abide by these guidelines
          </p>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
