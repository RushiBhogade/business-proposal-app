import React, { useState, useRef } from "react";
import { db } from "./firebase"; // Import your firebase configuration
import { collection, addDoc } from "firebase/firestore";
import { useReactToPrint } from "react-to-print";
import "./BusinessInput.css"; // Import your CSS for styling
import Navbar from "./Navbar"; // Import your Navbar component

const BusinessInput = () => {
  const [businessDetails, setBusinessDetails] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "",
    goals: "",
    challenges: "",
    targetMarket: "",
  });
  const [proposalContent, setProposalContent] = useState(null);
  const [quotationContent, setQuotationContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);
  const [isProposalAccepted, setIsProposalAccepted] = useState(false);

  // Reference for the quotation div to print
  const quotationRef = useRef();

  // Ensure the ref points to the content you want to print
  const handlePrint = useReactToPrint({
    content: () => quotationRef.current, // Reference for the content you want to print
    documentTitle: "Quotation", // Set a title for the printed document
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails((prev) => ({ ...prev, [name]: value }));
  };

  const generateContent = async (prompt) => {
    const apiKey = "AIzaSyAyyQgmX7YpkIi_HNDxc4yyCMvorFYm0Hk"; // Update with your own API key
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate content: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const proposalPrompt = `Generate a business proposal for ${businessDetails.companyName} in the ${businessDetails.industry} industry. Their goals are ${businessDetails.goals}. They face challenges such as ${businessDetails.challenges}. Their target market is ${businessDetails.targetMarket}. Provide the proposal in a professional tone.`;
      const generatedProposal = await generateContent(proposalPrompt);
      setProposalContent(generatedProposal);

      // Store the proposal in Firebase
      await addDoc(collection(db, "businessProposals"), {
        businessDetails,
        proposal: generatedProposal,
        timestamp: new Date(),
      });

      setShowProposal(true);
    } catch (error) {
      console.error("Error occurred:", error);
      alert(
        "An error occurred while generating the proposal. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptProposal = async () => {
    setIsLoading(true);
    setIsProposalAccepted(true);
    try {
      const quotationPrompt = `Generate a quotation table for ${businessDetails.companyName} in the ${businessDetails.industry} industry. Their goals are ${businessDetails.goals}. They face challenges such as ${businessDetails.challenges}. Their target market is ${businessDetails.targetMarket}. Please provide the quotation in a markdown table format with proper points, total price breakdown, and all.`;
      const generatedQuotation = await generateContent(quotationPrompt);
      setQuotationContent(generatedQuotation);

      // Store the quotation in Firebase
      await addDoc(collection(db, "businessQuotations"), {
        businessDetails,
        quotation: generatedQuotation,
        timestamp: new Date(),
      });

      setShowQuotation(true);
    } catch (error) {
      console.error("Error occurred:", error);
      alert(
        "An error occurred while generating the quotation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="business-input">
      <Navbar />
      <h2>Business Quotation Generator</h2>
      <form onSubmit={handleSubmit} className="business-input-form">
        <input
          type="text"
          name="companyName"
          value={businessDetails.companyName}
          onChange={handleInputChange}
          placeholder="Company Name"
          required
        />
        <input
          type="text"
          name="contactPerson"
          value={businessDetails.contactPerson}
          onChange={handleInputChange}
          placeholder="Contact Person"
          required
        />
        <input
          type="email"
          name="email"
          value={businessDetails.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="tel"
          name="phone"
          value={businessDetails.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          required
        />
        <input
          type="text"
          name="industry"
          value={businessDetails.industry}
          onChange={handleInputChange}
          placeholder="Industry"
          required
        />
        <textarea
          name="goals"
          value={businessDetails.goals}
          onChange={handleInputChange}
          placeholder="Business Goals"
          required
        />
        <textarea
          name="challenges"
          value={businessDetails.challenges}
          onChange={handleInputChange}
          placeholder="Challenges"
          required
        />
        <input
          type="text"
          name="targetMarket"
          value={businessDetails.targetMarket}
          onChange={handleInputChange}
          placeholder="Target Market"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Proposal"}
        </button>
      </form>

      {showProposal && (
        <div className="proposal-output">
          <h2>Business Proposal</h2>
          <pre>{proposalContent}</pre>

          {!isProposalAccepted && (
            <button onClick={handleAcceptProposal} className="accept-button">
              Accept Proposal
            </button>
          )}
        </div>
      )}

      {showQuotation && isProposalAccepted && (
        <div ref={quotationRef} className="quotation-output">
          <h2>Quotation</h2>
          <pre>{quotationContent}</pre>

          <button onClick={handlePrint} className="print-button">
            Download Quotation as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessInput;
