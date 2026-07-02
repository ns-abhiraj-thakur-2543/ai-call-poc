import { useState } from "react";
import "./App.css";

// Replace the old hardcoded strings with this:
const API_URL = "/poc-demo/api/call_interview_demo";

const DEFAULT_GENERAL_QUESTIONS = [
  "How did you hear about this opportunity?",
  "How familiar are you with our company and its mission?",
  "What motivated you to explore new opportunities and how does this role align with your career aspirations?",
  "Walk me through your background and give a high-level overview of your work experience.",
  "Please describe how your career experience makes you a great fit for this role.",
  "What skills or qualifications do you think are most relevant to this job and why?",
  "What are your long-term career goals and how does this role fit into your overall career aspirations?",
  "What is most important to you as you look for a new role and a new company?",
  "How is your job search going and do you have any other opportunities you are seriously considering?",
  "How quickly are you looking to start a new role and how much time will you need before you start?",
];

const DEFAULT_JOB_DESCRIPTION = `# Job Title: 3D Creative Technologist

### Location: Al Barsha 3, Dubai
### Job Type: Freelance
### Company: Buildup

## About the Role
The 3D Creative Technologist will create innovative and immersive 3D experiences for clients by combining creativity and technology. The role involves collaborating with cross-functional teams, developing 3D concepts, and staying current with emerging technologies.

## Responsibilities
- Develop and implement 3D designs and immersive experiences.
- Collaborate with designers and project teams.
- Research emerging 3D technologies.
- Troubleshoot technical issues.
- Deliver projects within deadlines.

## Required Qualifications
- Master's degree in a relevant field.
- 5-10 years of experience in 3D design and development.
- Proficiency with modern 3D design tools.
- Strong problem-solving, communication, and collaboration skills.

## Nice to Have
- Experience with AR/VR.
- Knowledge of interactive media.
- Familiarity with emerging 3D technologies.

## What We Offer
- Competitive hourly rate ($17-30/hour).
- Diverse and exciting projects.
- Collaborative work environment.
- Professional development opportunities.`;

const DEFAULT_COMPANY_DESCRIPTION =
  "Buildup is a leading brand experience partner with over a decade of expertise in the exhibitions and events industry. The company is headquartered in Dubai, United Arab Emirates, and specializes in transforming brands into unforgettable experiences through creativity, technology, and storytelling. Buildup offers services including event planning, space design, and brand storytelling, serving industries such as aviation, defense, education, healthcare, and real estate. The company focuses on meticulous planning, strategic insight, world-class craftsmanship, and building long-term client relationships while delivering tailored, immersive brand experiences.";

function App() {
  const [company, setCompany] = useState("Buildup");
  const [name, setName] = useState("Sebastian");
  const [role, setRole] = useState("3D Creative Technologist");
  const [phoneNumber, setPhoneNumber] = useState("+1");
  const [generalQuestions, setGeneralQuestions] = useState(
    DEFAULT_GENERAL_QUESTIONS,
  );
  const [companyDescriptionCulture, setCompanyDescriptionCulture] = useState(
    DEFAULT_COMPANY_DESCRIPTION,
  );
  const [useCompanyDescriptionCulture, setUseCompanyDescriptionCulture] =
    useState(true);
  const [jobDescription, setJobDescription] = useState(DEFAULT_JOB_DESCRIPTION);
  const [candidateInto, setCandidateInto] = useState(true);
  const [candidateEnquiries, setCandidateEnquiries] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const phoneDigits = phoneNumber.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length >= 10;

  const buildPayload = () => {
    const parsedQuestions = generalQuestions
      .map((q) => q.trim())
      .filter(Boolean);
    const descriptionCultureValue = companyDescriptionCulture.trim();
    const descriptionCulturePayload = useCompanyDescriptionCulture
      ? descriptionCultureValue
      : null;

    return {
      phone_number_id: "",
      email: "s.hartmann@yopmail.com",
      company: company.trim(),
      name: name.trim(),
      role: role.trim(),
      phone_number: phoneNumber.trim(),
      booking_id: "13392",
      general_questions: parsedQuestions,
      resume_questions: [],
      company_description: descriptionCulturePayload,
      job_description: jobDescription.trim(),
      company_culture: descriptionCulturePayload,
      env: "stag",
      spanish: false,
      secondary_language: null,
      candidate_into: candidateInto,
      candidate_enquiries: candidateEnquiries,
      needsConsent: true,
    };
  };

  const updateQuestion = (index, value) => {
    setGeneralQuestions((existing) =>
      existing.map((question, questionIndex) =>
        questionIndex === index ? value : question,
      ),
    );
  };

  const addQuestion = () => {
    setGeneralQuestions((existing) => [...existing, ""]);
  };

  const removeQuestion = (index) => {
    setGeneralQuestions((existing) => {
      if (existing.length <= 1) {
        return existing;
      }
      return existing.filter((_, questionIndex) => questionIndex !== index);
    });
  };

  const resetDefaultQuestions = () => {
    setGeneralQuestions(DEFAULT_GENERAL_QUESTIONS);
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isPhoneValid) {
      setError(
        "Phone number must be in international format, for example +917015319793.",
      );
      return;
    }

    const payload = buildPayload();
    if (payload.general_questions.length === 0) {
      setError("General questions must include at least one question.");
      return;
    }

    if (
      useCompanyDescriptionCulture &&
      companyDescriptionCulture.trim().length < 50
    ) {
      setError(
        "Company description/culture must be at least 50 characters when enabled.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const [response] = await Promise.all([
        fetch(API_URL, {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }),
        wait(3000),
      ]);

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = { message: "Non-JSON response received from server." };
      }

      if (!response.ok) {
        const message =
          data?.message || `Request failed with status ${response.status}.`;
        throw new Error(message);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to call interview API.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <header className="card-header">
          <p className="eyebrow">POC Demo</p>
          <h1>AI Interview Call Initiator</h1>
          <p className="subtitle">
            Submit candidate and context data to trigger an automated interview
            call.
          </p>
        </header>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Company
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </label>

          <label>
            Candidate Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Role
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </label>

          <label>
            Phone Number (with country code)
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              required
            />
            {phoneNumber.trim() && !isPhoneValid && (
              <span className="field-error">Enter at least 10 digits</span>
            )}
          </label>

          <section className="full-width question-section">
            <div className="question-section-header">
              <h2>General Questions</h2>
              <p>{generalQuestions.length} configured</p>
            </div>

            <div className="question-list">
              {generalQuestions.map((question, index) => (
                <div className="question-item" key={`question-${index}`}>
                  <div className="question-number">Q{index + 1}</div>
                  <input
                    value={question}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    placeholder="Type interview question"
                  />
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => removeQuestion(index)}
                    disabled={generalQuestions.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="question-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={addQuestion}
              >
                Add Question
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={resetDefaultQuestions}
              >
                Reset Default 10
              </button>
            </div>
          </section>

          <section className="full-width description-section">
            <div className="description-section-header">
              <div>
                <h2>Company Description/Culture</h2>
              </div>

              <label className="checkbox-row description-toggle">
                <input
                  type="checkbox"
                  checked={useCompanyDescriptionCulture}
                  onChange={(e) =>
                    setUseCompanyDescriptionCulture(e.target.checked)
                  }
                />
              </label>
            </div>

            <textarea
              rows={6}
              value={companyDescriptionCulture}
              onChange={(e) => setCompanyDescriptionCulture(e.target.value)}
              placeholder="Add company description/culture content"
              disabled={!useCompanyDescriptionCulture}
            />

            <div className="description-footer">
              <span>Minimum 50 characters required</span>
              {useCompanyDescriptionCulture && (
                <span>
                  {companyDescriptionCulture.trim().length} characters
                </span>
              )}
            </div>
          </section>

          <label className="full-width">
            Job Description
            <textarea
              rows={14}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={candidateInto}
              onChange={(e) => setCandidateInto(e.target.checked)}
            />
            Candidate Intro
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={candidateEnquiries}
              onChange={(e) => setCandidateEnquiries(e.target.checked)}
            />
            Candidate Enquiry
          </label>

          <div className="actions full-width">
            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting || !isPhoneValid}
            >
              {isSubmitting ? (
                <span className="button-content">
                  <span className="loader" aria-hidden="true"></span>
                  Initiating Call...
                </span>
              ) : (
                "Initiate AI Call"
              )}
            </button>
          </div>
        </form>

        {error && <p className="error-box">{error}</p>}
      </section>
    </main>
  );
}

export default App;
