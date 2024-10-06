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
  const [quotationContent, setQuotationContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);

  const quotationRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => quotationRef.current,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessDetails((prev) => ({ ...prev, [name]: value }));
  };

  const generateContent = async (prompt) => {
    const apiKey = "AIzaSyAyyQgmX7YpkIi_HNDxc4yyCMvorFYm0Hk";
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
      const quotationPrompt = `Generate a quotation table for ${businessDetails.companyName} in the ${businessDetails.industry} industry. Their goals are ${businessDetails.goals}. They face challenges such as ${businessDetails.challenges}. Their target market is ${businessDetails.targetMarket}. Please provide the quotation in a markdown table format with the following columns: Item Description, Quantity, Unit Price, Total Price.`;
      const generatedQuotation = await generateContent(quotationPrompt);
      setQuotationContent(generatedQuotation);

      // Save to Firebase
      await addDoc(collection(db, "businessQuotations"), {
        businessDetails,
        quotation: generatedQuotation,
        timestamp: new Date(),
      });

      setShowQuotation(true);
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred. Please try again.");
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
          {isLoading ? "Generating..." : "Generate Quotation"}
        </button>
      </form>

      {showQuotation && (
        <div ref={quotationRef} className="quotation-output">
          <h2>Quotation</h2>
          <table className="quotation-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Service 1</td>
                <td>10 Hours</td>
                <td>$100</td>
                <td>$1000</td>
              </tr>
              <tr>
                <td>Service 2</td>
                <td>5 Hours</td>
                <td>$150</td>
                <td>$750</td>
              </tr>
              <tr>
                <td>Service 3</td>
                <td>3 Hours</td>
                <td>$200</td>
                <td>$600</td>
              </tr>
              {/* Add more rows dynamically from generated data */}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3">Total</td>
                <td>$2350</td>
              </tr>
            </tfoot>
          </table>

          <button onClick={handlePrint} className="print-button">
            Download Quotation as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessInput;
