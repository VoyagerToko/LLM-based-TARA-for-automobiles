document.getElementById("taraForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loading = document.getElementById("loading");
  const submitButton = e.target.querySelector("button");

  loading.style.display = "block";
  submitButton.disabled = true;

  const functionality = document.getElementById("functionality").value.trim();
  const system_boundaries = document.getElementById("boundaries").value.trim();
  const interfaces = document.getElementById("interfaces").value.trim();

  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ functionality, system_boundaries, interfaces })
    });

    const resultArray = await response.json();
    const result = resultArray[0];  // Your actual data is the first object

    document.getElementById("tabs").style.display = "block";
    document.getElementById("tab-nav").style.display = "flex";

    // Tab 0: Asset Identification
    document.getElementById("tab0").innerHTML = `
      <h3>Asset Identification</h3>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Prospect</th></tr></thead>
        <tbody>
          <tr>
            <td>${result["asset id"] || "—"}</td>
            <td>${result["asset name"] || "—"}</td>
            <td>${result["asset type"] || "—"}</td>
            <td>${result["cybersecurity prospect"] || "—"}</td>
          </tr>
        </tbody>
      </table>`;

    // Tab 1: Damage Scenario
    document.getElementById("tab1").innerHTML = `
      <h3>Damage Scenario</h3>
      <table>
        <thead><tr><th>Severe Consequences</th><th>Scenario</th><th>Rationale</th></tr></thead>
        <tbody>
          <tr>
            <td>${result["severe consequences"] || "—"}</td>
            <td>${result["damage scenario"] || "—"}</td>
            <td>${result["damage scenario rationale"] || "—"}</td>
          </tr>
        </tbody>
      </table>`;

    // Tab 2: Threat Identification
    document.getElementById("tab2").innerHTML = `
      <h3>Threat Identification</h3>
      <table>
        <thead><tr><th>STRIDE</th><th>Level</th><th>Scenario</th></tr></thead>
        <tbody>
          <tr>
            <td>${result["STRIDE classification"] || "—"}</td>
            <td>${result["threat level"] || "—"}</td>
            <td>${result["threat scenario"] || "—"}</td>
          </tr>
        </tbody>
      </table>`;

    // Tab 3: Impact Rating
    document.getElementById("tab3").innerHTML = `
      <h3>Impact Rating</h3>
      <table>
        <thead><tr>
          <th>Safety</th><th>Privacy</th><th>Operational</th><th>Financial</th>
          <th>Brand</th><th>Financial (OEM)</th><th>Operational (OEM)</th><th>Sum</th><th>Rating</th>
        </tr></thead>
        <tbody>
          <tr>
            <td>${result["safety (road view)"] || "—"}</td>
            <td>${result["privacy (road view)"] || "—"}</td>
            <td>${result["operational (road view)"] || "—"}</td>
            <td>${result["financial (road view)"] || "—"}</td>
            <td>${result["brand (OEM view)"] || "—"}</td>
            <td>${result["financial (OEM view)"] || "—"}</td>
            <td>${result["operational (OEM view)"] || "—"}</td>
            <td>${result["impact sum"] || "—"}</td>
            <td>${result["impact rating"] || "—"}</td>
          </tr>
        </tbody>
      </table>`;

    // Tab 4: Attack Path
    document.getElementById("tab4").innerHTML = `
      <h3>Attack Path</h3>
      <table>
        <thead><tr><th>ID</th><th>Path</th><th>Vector</th><th>CAL</th></tr></thead>
        <tbody>
          <tr>
            <td>${result["attack path id"] || "—"}</td>
            <td>${result["attack path"] || "—"}</td>
            <td>${result["attack vector"] || "—"}</td>
            <td>${result["CAL analysis"] || "—"}</td>
          </tr>
        </tbody>
      </table>`;

    // Tab 5: Feasibility
    document.getElementById("tab5").innerHTML = `
      <h3>Attack Feasibility</h3>
      <table>
        <thead><tr><th>Elapsed</th><th>Expertise</th><th>Knowledge</th><th>Window</th><th>Equipment</th><th>Potential</th><th>Rating</th><th>Rationale</th></tr></thead>
        <tbody>
          <tr>
            <td>${result["elapsed time"] || "—"}</td>
            <td>${result["special expertise"] || "—"}</td>
            <td>${result["knowledge of item"] || "—"}</td>
            <td>${result["window of opportunity"] || "—"}</td>
            <td>${result["equipment"] || "—"}</td>
            <td>${result["attack potential"] || "—"}</td>
            <td>${result["attack feasibility rating"] || "—"}</td>
            <td>${result["attack feasibility rationale"] || "—"}</td>
          </tr>
        </tbody>
      </table>`;

    // Tab 6: Risk Treatment
    document.getElementById("tab6").innerHTML = `
      <h3>Risk Treatment</h3>
      <table>
        <thead><tr><th>Max Risk</th><th>Rating</th><th>Treatment</th><th>Rationale</th><th>Goals</th><th>Claims</th></tr></thead>
        <tbody>
          <tr>
            <td>${result["maximal risk value"] || "—"}</td>
            <td>${result["risk rating"] || "—"}</td>
            <td>${result["risk treatment"] || "—"}</td>
            <td>${result["risk treatment decision rationale"] || "—"}</td>
            <td>${result["cyber security goals"] || "—"}</td>
            <td>${result["cybersecurity claims"] || "—"}</td>
          </tr>
        </tbody>
      </table>`;

    // Tab 7: Security Control
    document.getElementById("tab7").innerHTML = `
      <h3>Security Control</h3>
      <table>
        <thead><tr><th>Strategy</th></tr></thead>
        <tbody><tr><td>${result["strategy for security control"] || "—"}</td></tr></tbody>
      </table>`;

    // Tab 8: Residual Risk (specialist expertise reuse from above)
    document.getElementById("tab8").innerHTML = `
      <h3>Residual Risk</h3>
      <table>
        <thead><tr>
          <th>Elapsed</th><th>Expertise</th><th>Knowledge</th><th>Window</th><th>Equipment</th>
          <th>Potential</th><th>Rating</th><th>Rationale</th><th>New Max Risk</th><th>New Max Rating</th>
        </tr></thead>
        <tbody>
          <tr>
            <td>${result["elapsed time"] || "—"}</td>
            <td>${result["specialist expertise"] || result["special expertise"] || "—"}</td>
            <td>${result["knowledge of item"] || "—"}</td>
            <td>${result["window of opportunity"] || "—"}</td>
            <td>${result["equipment"] || "—"}</td>
            <td>${result["attack potential"] || "—"}</td>
            <td>${result["attack feasibility rating"] || "—"}</td>
            <td>${result["attack feasibility rationale"] || "—"}</td>
            <td>${result["new maximal risk value"] || "—"}</td>
            <td>${result["new maximal risk rating"] || "—"}</td>
          </tr>
        </tbody>
      </table>`;

    // Tab 9: Raw JSON Output
   // Tab 9: Raw JSON Output
const rawJson = JSON.stringify(result, null, 2);
document.getElementById("tab9").innerHTML = `
  <h3>Raw JSON Output</h3>
  <button onclick="downloadRawJson()">Download JSON</button>
  <pre>${rawJson}</pre>`;


    showTab(0);

  } catch (err) {
    alert("Error: Could not analyze threat. Check console.");
    console.error(err);
  } finally {
    loading.style.display = "none";
    submitButton.disabled = false;
  }
});

function showTab(index) {
  document.querySelectorAll(".tab-content").forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });
  document.querySelectorAll(".tab-nav li").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}

function downloadRawJson() {
  const jsonData = document.querySelector("#tab9 pre").textContent;
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = "tara_output.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
