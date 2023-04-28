// This component is used to build the functionality
// of the Quickstart Guides page.

import React, { useState, useEffect } from "react";
import style from "./styles.module.css";

function QuickstartTOC() {
  const [mounted, setMounted] = useState(false);
  const [tocData, setTocData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  console.log("activeStep", activeStep);

  useEffect(() => {
    // Get all h2 for each step in the guide
    const steps = document.querySelectorAll("h2");
    const stepContainer = document.querySelector(".step-container");
    const snippetContainer = document.querySelectorAll(
      ".snippet_src-components-snippet-styles-module"
    );

    // undwrap the snippet container and remove the div leaving the children
    snippetContainer.forEach((snippet) => {
      const parent = snippet.parentNode;
      while (snippet.firstChild)
        parent.insertBefore(snippet.firstChild, snippet);
      parent.removeChild(snippet);
    });

    // Create an array of objects with the id and title of each step
    const data = Array.from(steps).map((step, index) => ({
      id: step.id,
      title: step.innerText,
      stepNumber: index,
    }));

    setTocData(data);
    setMounted(true);
    setActiveStep(0);

    // Wrap all h2 (steps), along with all of their direct siblings, in a div until the next h2
    if (mounted) {
      steps.forEach((step, index) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("step-wrapper");
        wrapper.classList.add("hidden");

        // Move the step and all its siblings into the its own div
        step.parentNode.insertBefore(wrapper, step);
        let currentElement = step;
        do {
          const nextElement = currentElement.nextElementSibling;
          wrapper.appendChild(currentElement);
          currentElement = nextElement;
          wrapper.setAttribute("data-step", index);
        } while (currentElement && currentElement.tagName !== "H2");
      });

      // Wrap any non-step content in a div for the quickstart intro
      const children = stepContainer.children;
      const stepWrapper = document.createElement("div");
      stepWrapper.classList.add("intro");

      while (
        children.length &&
        children[0].classList.contains("step-wrapper") === false
      ) {
        stepWrapper.appendChild(children[0]);
      }
      stepContainer.appendChild(stepWrapper);

      const initialStep = document.querySelector(
        `.step-wrapper[data-step='${activeStep}']`
      );
      if (initialStep) {
        initialStep.classList.remove("hidden");
      }
    }

    // Add Next/Prev buttons to step-wrapper divs
    if (mounted) {
      const stepWrappers = document.querySelectorAll(".step-wrapper");

      stepWrappers.forEach((stepWrapper, index) => {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(style.buttonContainer);
        const prevButton = document.createElement("a");
        const nextButton = document.createElement("a");

        prevButton.textContent = "Back";
        prevButton.classList.add(style.button);
        prevButton.disabled = index === 0;
        prevButton.addEventListener("click", () => handlePrev(index));

        nextButton.textContent = "Next";
        nextButton.classList.add(style.button);
        nextButton.disabled = index === stepWrappers.length - 1;
        nextButton.addEventListener("click", () => handleNext(index));

        buttonContainer.appendChild(prevButton);
        buttonContainer.appendChild(nextButton);

        stepWrapper.appendChild(buttonContainer);
      });
    }
  }, [mounted]);


  // Hide the intro if active step is greater than 0
  useEffect(() => {
    const introDiv = document.querySelector(".intro");

    if (activeStep > 0 && introDiv) {
      introDiv.classList.add("hidden");
    } else if (activeStep === 0 && introDiv) {
        introDiv.classList.remove("hidden");
    }

    // Scroll to the top of the page if the content is longer than the viewport
    if (window.scrollY > 0) {
        window.scrollTo(0, 0);
    }

  }, [activeStep]);

  // Handle updating the active step
  const updateStep = (currentStepIndex, newStepIndex) => {
    const currentStep = document.querySelector(
      `.step-wrapper[data-step='${currentStepIndex}']`
    );
    const newStep = document.querySelector(
      `.step-wrapper[data-step='${newStepIndex}']`
    );

    currentStep?.classList.add("hidden");
    newStep?.classList.remove("hidden");  

    setActiveStep(newStepIndex);
  };

  const handleNext = (currentStepIndex) => {
    if (currentStepIndex < tocData.length - 1) {
      updateStep(currentStepIndex, currentStepIndex + 1);
    }
  };

  const handlePrev = (currentStepIndex) => {
    if (currentStepIndex > 0) {
      updateStep(currentStepIndex, currentStepIndex - 1);
    }
  };

  // Handle TOC click
  const handleTocClick = (e) => {
    let stepNumber = parseInt(e.target.dataset.step);

    const step = document.querySelector(
      `.step-wrapper[data-step='${stepNumber}']`
    );

    const currentStep = document.querySelector(".step-wrapper:not(.hidden)");

    currentStep?.classList.add("hidden");
    step?.classList.remove("hidden");

    setActiveStep(stepNumber);
  };

  return (
    <ul className={style.tocList}>
      {tocData.map((step, index) => (
        <li key={step.id} data-step={index} onClick={handleTocClick}>
          <span>{step.stepNumber + 1}</span> {step.title}
        </li>
      ))}
    </ul>
  );
}

export default QuickstartTOC;