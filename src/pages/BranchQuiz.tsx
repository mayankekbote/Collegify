import React, { useState } from 'react';
import { Brain, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { quizAPI } from '../utils/api';

interface Question {
  id: number;
  text: string;
  options: string[];
}

const BranchQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: "Which field interests you the most?",
      options: [
        "Software development and programming",
        "Hardware design and electronics",
        "Construction and infrastructure",
        "Manufacturing and production",
        "Electrical systems and power"
      ]
    },
    {
      id: 2,
      text: "What type of work environment do you prefer?",
      options: [
        "Office-based with computers",
        "Laboratory with testing equipment",
        "Field work and site visits",
        "Factory floor and production units",
        "Mix of office and field work"
      ]
    },
    {
      id: 3,
      text: "Which subject did you enjoy most in school?",
      options: [
        "Mathematics and Logic",
        "Physics and Electronics",
        "Applied Physics and Mechanics",
        "Chemistry and Materials",
        "Physics and Electrical concepts"
      ]
    },
    {
      id: 4,
      text: "What motivates you the most?",
      options: [
        "Creating innovative software solutions",
        "Building electronic devices and circuits",
        "Designing structures and buildings",
        "Improving manufacturing processes",
        "Working with power systems and automation"
      ]
    },
    {
      id: 5,
      text: "Which career path appeals to you?",
      options: [
        "Software Engineer at tech companies",
        "Electronics Engineer in R&D",
        "Civil Engineer in construction",
        "Mechanical Engineer in automotive",
        "Electrical Engineer in power sector"
      ]
    },
    {
      id: 6,
      text: "What type of problems do you enjoy solving?",
      options: [
        "Algorithmic and computational challenges",
        "Circuit design and signal processing",
        "Structural analysis and design problems",
        "Mechanical systems and thermodynamics",
        "Power distribution and control systems"
      ]
    },
    {
      id: 7,
      text: "Which technology trend excites you most?",
      options: [
        "Artificial Intelligence and Machine Learning",
        "Internet of Things and Smart Devices",
        "Smart Cities and Sustainable Construction",
        "Automation and Robotics",
        "Renewable Energy and Smart Grids"
      ]
    },
    {
      id: 8,
      text: "What is your preferred learning style?",
      options: [
        "Hands-on coding and programming",
        "Laboratory experiments and prototyping",
        "Site visits and practical applications",
        "Workshop practice and machine operation",
        "Theory combined with practical experiments"
      ]
    }
  ];

  const branchMapping = {
    "Software development and programming":
      "Computer Engineering and Information Technology",
    "Office-based with computers":
      "Computer Engineering and Information Technology",
    "Mathematics and Logic": "Computer Engineering and Information Technology",
    "Creating innovative software solutions":
      "Computer Engineering and Information Technology",
    "Software Engineer at tech companies":
      "Computer Engineering and Information Technology",
    "Algorithmic and computational challenges":
      "Computer Engineering and Information Technology",
    "Artificial Intelligence and Machine Learning":
      "Computer Engineering and Information Technology",
    "Hands-on coding and programming":
      "Computer Engineering and Information Technology",

    "Hardware design and electronics": "Electronics and Telecommunication",
    "Laboratory with testing equipment": "Electronics and Telecommunication",
    "Physics and Electronics": "Electronics and Telecommunication",
    "Building electronic devices and circuits":
      "Electronics and Telecommunication",
    "Electronics Engineer in R&D": "Electronics and Telecommunication",
    "Circuit design and signal processing": "Electronics and Telecommunication",
    "Internet of Things and Smart Devices": "Electronics and Telecommunication",
    "Laboratory experiments and prototyping":
      "Electronics and Telecommunication",

    "Construction and infrastructure": "Civil Engineering",
    "Field work and site visits": "Civil Engineering",
    "Applied Physics and Mechanics": "Civil Engineering",
    "Designing structures and buildings": "Civil Engineering",
    "Civil Engineer in construction": "Civil Engineering",
    "Structural analysis and design problems": "Civil Engineering",
    "Smart Cities and Sustainable Construction": "Civil Engineering",
    "Site visits and practical applications": "Civil Engineering",

    "Manufacturing and production": "Mechanical Engineering",
    "Factory floor and production units": "Mechanical Engineering",
    "Chemistry and Materials": "Mechanical Engineering",
    "Improving manufacturing processes": "Mechanical Engineering",
    "Mechanical Engineer in automotive": "Mechanical Engineering",
    "Mechanical systems and thermodynamics": "Mechanical Engineering",
    "Automation and Robotics": "Mechanical Engineering",
    "Workshop practice and machine operation": "Mechanical Engineering",

    "Electrical systems and power": "Electrical Engineering",
    "Mix of office and field work": "Electrical Engineering",
    "Physics and Electrical concepts": "Electrical Engineering",
    "Working with power systems and automation": "Electrical Engineering",
    "Electrical Engineer in power sector": "Electrical Engineering",
    "Power distribution and control systems": "Electrical Engineering",
    "Renewable Energy and Smart Grids": "Electrical Engineering",
    "Theory combined with practical experiments": "Electrical Engineering",
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    
    try {
      // Calculate branch preferences locally
      const branchScores: { [key: string]: number } = {};
      
      Object.values(answers).forEach(answer => {
        const branch = branchMapping[answer as keyof typeof branchMapping];
        if (branch) {
          branchScores[branch] = (branchScores[branch] || 0) + 1;
        }
      });

      // Sort branches by score
      const sortedBranches = Object.entries(branchScores)
        .sort(([,a], [,b]) => b - a)
        .map(([branch, score]) => ({ branch, score: Math.round((score / questions.length) * 100) }));

      const quizResult = {
        answers,
        suggested_branches: JSON.stringify(sortedBranches.map(b => b.branch)),
        score: sortedBranches[0]?.score || 0
      };

      // Try to submit to backend, but continue even if it fails
      try {
        await quizAPI.submit(quizResult);
      } catch (error) {
        console.log('Could not save quiz results to server');
      }

      setResults({
        suggested_branches: sortedBranches,
        score: sortedBranches[0]?.score || 0
      });
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  const getBranchDescription = (branch: string): string => {
    const descriptions: { [key: string]: string } = {
      "Computer Engineering": "Focus on software development, programming, algorithms, and computer systems. High demand in IT industry with excellent career prospects.",
      "Electronics and Telecommunication": "Work with electronic circuits, communication systems, signal processing, and embedded systems. Growing field with IoT and smart device development.",
      "Civil Engineering": "Design and construct infrastructure, buildings, roads, and bridges. Fundamental field with steady demand in construction and urban development.",
      "Mechanical Engineering": "Deal with mechanical systems, manufacturing, automotive, and industrial processes. Versatile field with applications across many industries.",
      "Electrical Engineering": "Work with power systems, electrical machines, control systems, and renewable energy. Essential field for power generation and distribution."
    };
    return descriptions[branch] || "Excellent engineering field with diverse opportunities.";
  };

  const getBranchIcon = (branch: string): string => {
    const icons: { [key: string]: string } = {
      "Computer Engineering": "💻",
      "Electronics and Telecommunication": "📡",
      "Civil Engineering": "🏗️",
      "Mechanical Engineering": "⚙️",
      "Electrical Engineering": "⚡"
    };
    return icons[branch] || "🎓";
  };

  if (showResults && results) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="glass-card text-center">
          <div style={{
            width: '100px',
            height: '100px',
            background: 'var(--success)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem'
          }}>
            <CheckCircle size={50} color="white" />
          </div>

          <h1 style={{ 
            fontFamily: 'Space Grotesk, sans-serif', 
            fontSize: '2.5rem', 
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            Quiz Complete!
          </h1>
          
          <p className="text-secondary mb-2" style={{ fontSize: '1.2rem' }}>
            Based on your responses, here are your recommended engineering branches:
          </p>

          <div style={{ 
            display: 'grid', 
            gap: '2rem', 
            marginTop: '3rem',
            textAlign: 'left'
          }}>
            {results.suggested_branches.slice(0, 3).map((branchData: any, index: number) => (
              <div key={index} className="glass-card" style={{
                background: index === 0 ? 'rgba(34, 197, 94, 0.1)' : 'var(--surface)',
                border: index === 0 ? '2px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--glass-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem' }}>
                    {getBranchIcon(branchData.branch)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h3 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 700,
                        color: index === 0 ? '#22c55e' : 'var(--text-primary)'
                      }}>
                        {index + 1}. {branchData.branch}
                        {index === 0 && (
                          <span style={{
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                            marginLeft: '1rem',
                            fontWeight: 600
                          }}>
                            BEST MATCH
                          </span>
                        )}
                      </h3>
                      <div style={{
                        background: index === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: index === 0 ? '#22c55e' : '#6366f1',
                        padding: '0.5rem 1rem',
                        borderRadius: '999px',
                        fontWeight: 700,
                        fontSize: '1.1rem'
                      }}>
                        {branchData.score}% Match
                      </div>
                    </div>
                    <p className="text-secondary">
                      {getBranchDescription(branchData.branch)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            marginTop: '3rem',
            flexWrap: 'wrap'
          }}>
            <button onClick={resetQuiz} className="btn btn-secondary">
              <RotateCcw size={20} />
              Retake Quiz
            </button>
            <a href="/college-finder" className="btn btn-primary">
              Find Colleges
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="glass-card">
        <div className="text-center mb-2">
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Brain size={40} color="white" />
          </div>
          <h1 style={{ 
            fontFamily: 'Space Grotesk, sans-serif', 
            fontSize: '2.5rem', 
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            Branch Discovery Quiz
          </h1>
          <p className="text-secondary">
            Discover the perfect engineering branch based on your interests and aptitude
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '999px',
          height: '8px',
          marginBottom: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'var(--primary)',
            height: '100%',
            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            borderRadius: '999px',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <span className="text-muted">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 600,
            marginBottom: '1.5rem',
            lineHeight: 1.4
          }}>
            {questions[currentQuestion].text}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`quiz-option ${answers[currentQuestion] === option ? 'selected' : ''}`}
                style={{
                  padding: '1rem 1.5rem',
                  border: answers[currentQuestion] === option 
                    ? '2px solid #6366f1' 
                    : '1px solid var(--glass-border)',
                  borderRadius: 'var(--border-radius)',
                  background: answers[currentQuestion] === option 
                    ? 'rgba(99, 102, 241, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: answers[currentQuestion] === option ? 600 : 400
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn btn-outline"
            style={{ 
              opacity: currentQuestion === 0 ? 0.5 : 1,
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion] || loading}
            className="btn btn-primary"
            style={{ 
              opacity: (!answers[currentQuestion] || loading) ? 0.5 : 1,
              cursor: (!answers[currentQuestion] || loading) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Analyzing...' : currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchQuiz;