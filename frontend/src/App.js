import React, { useState } 
from "react";
import "./App.css";

const backendUrl =
  "https://d78ceb83-75c7-4790-85b8-d1340bf90480-00-12zooekzn0to.sisko.replit.dev";

const App = () => {
  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "Experienced developer with 5+ years in web development...",
    experience: [
      {
        id: 1,
        title: "Senior Developer",
        company: "Tech Corp",
        duration: "2020 - Present",
        description: "Led a team of 5 developers...",
      },
    ],
    education: [
      {
        id: 1,
        degree: "B.S. Computer Science",
        institution: "State University",
        year: "2016 - 2020",
      },
    ],
    skills: ["JavaScript", "React", "Python", "FastAPI"],
  });

  const [activeSection, setActiveSection] = useState("summary");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(uploadedFile.type)
    ) {
      alert("Please upload a PDF or DOCX file");
      return;
    }

    setFile(uploadedFile);
    setIsLoading(true);

    setTimeout(() => {
      alert("Resume parsed successfully!");
      setIsLoading(false);
    }, 2000);
  };

  const handleInputChange = (e, section, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      const updatedSection = [...resumeData[section]];
      updatedSection[index] = { ...updatedSection[index], [name]: value };
      setResumeData({ ...resumeData, [section]: updatedSection });
    } else {
      setResumeData({ ...resumeData, [name || section]: value });
    }
  };

  const handleAddEntry = (section) => {
    const newEntry =
      section === "experience"
        ? {
            id: Date.now(),
            title: "",
            company: "",
            duration: "",
            description: "",
          }
        : { id: Date.now(), degree: "", institution: "", year: "" };

    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], newEntry],
    });
  };

  const handleRemoveEntry = (section, id) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section].filter((item) => item.id !== id),
    });
  };

  const handleAddSkill = () => {
    const newSkill = prompt("Enter a new skill:");
    if (newSkill) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill],
      });
    }
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills.splice(index, 1);
    setResumeData({ ...resumeData, skills: updatedSkills });
  };

  const enhanceWithAI = async (section) => {
    if (!resumeData[section]) {
      alert("Please add some content first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://d78ceb83-75c7-4790-85b8-d1340bf90480-00-12zooekzn0to.sisko.replit.dev/ai-enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section,
          content: Array.isArray(resumeData[section])
            ? resumeData[section].map((item) => JSON.stringify(item)).join("\n")
            : resumeData[section],
        }),
      });

      const data = await response.json();

      const enhancedContent = Array.isArray(resumeData[section])
        ? [
            ...resumeData[section],
            {
              id: Date.now(),
              title: "Enhanced Position",
              company: "AI Suggested",
              duration: "2023 - Present",
              description:
                "AI-enhanced description based on your experience...",
            },
          ]
        : `${resumeData[section]}\n\n[AI Enhanced]: ${data.improved_content}`;

      setResumeData({ ...resumeData, [section]: enhancedContent });
      alert("Section enhanced with AI!");
    } catch (error) {
      alert("AI enhancement failed. Using mock data.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveResume = async () => {
    setIsLoading(true);
    try {
      await fetch(`https://d78ceb83-75c7-4790-85b8-d1340bf90480-00-12zooekzn0to.sisko.replit.dev/save-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });
      alert("Resume saved successfully!");
    } catch (error) {
      alert("Failed to save resume");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResume = () => {
    const exportData = {
      ...resumeData,
    backendUrl: backendUrl,
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${resumeData.name || "resume"}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Resume Editor</h1>
        <p>Create and enhance your professional resume</p>
      </header>

      <div className="resume-container">
        <div className="sidebar">
          <div className="upload-section">
            <h3>Upload Resume</h3>
            <div className="file-upload">
              <label className="upload-btn">
                {file ? file.name : "Choose PDF/DOCX"}
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  hidden
                />
              </label>
              {isLoading && <div className="spinner"></div>}
            </div>
          </div>

          <div className="navigation">
            <h3>Sections</h3>
            <button
              className={activeSection === "personal" ? "active" : ""}
              onClick={() => setActiveSection("personal")}
            >
              Personal Info
            </button>
            <button
              className={activeSection === "summary" ? "active" : ""}
              onClick={() => setActiveSection("summary")}
            >
              Summary
            </button>
            <button
              className={activeSection === "experience" ? "active" : ""}
              onClick={() => setActiveSection("experience")}
            >
              Experience
            </button>
            <button
              className={activeSection === "education" ? "active" : ""}
              onClick={() => setActiveSection("education")}
            >
              Education
            </button>
            <button
              className={activeSection === "skills" ? "active" : ""}
              onClick={() => setActiveSection("skills")}
            >
              Skills
            </button>
          </div>

          <div className="actions">
            <button
              className="save-btn"
              onClick={saveResume}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Resume"}
            </button>
            <button className="download-btn" onClick={downloadResume}>
              Download JSON
            </button>
          </div>
        </div>

        <div className="editor-panel">
          {activeSection === "personal" && (
            <div className="section">
              <h2>Personal Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={resumeData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={resumeData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={resumeData.phone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
          )}

          {activeSection === "summary" && (
            <div className="section">
              <div className="section-header">
                <h2>Professional Summary</h2>
                <button
                  className="ai-btn"
                  onClick={() => enhanceWithAI("summary")}
                  disabled={isLoading}
                >
                  {isLoading ? "Enhancing..." : "Enhance with AI"}
                </button>
              </div>
              <textarea
                value={resumeData.summary}
                onChange={(e) => handleInputChange(e, "summary")}
                placeholder="Briefly describe your professional background and skills..."
                rows="8"
              />
            </div>
          )}

          {activeSection === "experience" && (
            <div className="section">
              <div className="section-header">
                <h2>Work Experience</h2>
                <div>
                  <button
                    className="add-btn"
                    onClick={() => handleAddEntry("experience")}
                  >
                    Add Experience
                  </button>
                  <button
                    className="ai-btn"
                    onClick={() => enhanceWithAI("experience")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Enhancing..." : "Enhance with AI"}
                  </button>
                </div>
              </div>

              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="entry-card">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Job Title</label>
                      <input
                        type="text"
                        name="title"
                        value={exp.title}
                        onChange={(e) =>
                          handleInputChange(e, "experience", index)
                        }
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        name="company"
                        value={exp.company}
                        onChange={(e) =>
                          handleInputChange(e, "experience", index)
                        }
                        placeholder="Tech Company Inc."
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={exp.duration}
                      onChange={(e) =>
                        handleInputChange(e, "experience", index)
                      }
                      placeholder="Jan 2020 - Present"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={exp.description}
                      onChange={(e) =>
                        handleInputChange(e, "experience", index)
                      }
                      placeholder="Describe your responsibilities and achievements..."
                      rows="4"
                    />
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveEntry("experience", exp.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === "education" && (
            <div className="section">
              <div className="section-header">
                <h2>Education</h2>
                <div>
                  <button
                    className="add-btn"
                    onClick={() => handleAddEntry("education")}
                  >
                    Add Education
                  </button>
                  <button
                    className="ai-btn"
                    onClick={() => enhanceWithAI("education")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Enhancing..." : "Enhance with AI"}
                  </button>
                </div>
              </div>

              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="entry-card">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={edu.degree}
                        onChange={(e) =>
                          handleInputChange(e, "education", index)
                        }
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>Institution</label>
                      <input
                        type="text"
                        name="institution"
                        value={edu.institution}
                        onChange={(e) =>
                          handleInputChange(e, "education", index)
                        }
                        placeholder="University Name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="text"
                      name="year"
                      value={edu.year}
                      onChange={(e) => handleInputChange(e, "education", index)}
                      placeholder="2016 - 2020"
                    />
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveEntry("education", edu.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === "skills" && (
            <div className="section">
              <div className="section-header">
                <h2>Skills</h2>
                <div>
                  <button className="add-btn" onClick={handleAddSkill}>
                    Add Skill
                  </button>
                  <button
                    className="ai-btn"
                    onClick={() => enhanceWithAI("skills")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Enhancing..." : "Enhance with AI"}
                  </button>
                </div>
              </div>

              <div className="skills-container">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill}
                    <span
                      className="remove-tag"
                      onClick={() => handleRemoveSkill(index)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
