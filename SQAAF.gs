function doGet() {
  return HtmlService.createHtmlOutput(`
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: sans-serif; text-align: center; padding: 30px; }
          button, input {
            font-size: 16px;
            padding: 10px;
            margin: 10px;
            border-radius: 6px;
            border: none;
          }
          button {
            background-color: #4CAF50;
            color: white;
            cursor: pointer;
          }
          button:disabled {
            background-color: gray;
            cursor: not-allowed;
          }
          input {
            width: 80%;
            border: 1px solid #ccc;
          }
          hr { margin: 30px 0; }
          .sqaaf-guide {
            max-width: 1000px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            font-family: 'Segoe UI', sans-serif;
            text-align: left;
          }

          .sqaaf-guide h2 {
            text-align: center;
            color: #333;
            font-size: 1.4rem;
            margin-bottom: 20px;
          }

          .sqaaf-guide ol {
            color: #444;
            font-size: 1rem;
            line-height: 1.7;
            padding-left: 1.2em;
          }

          .sqaaf-guide a {
            color: #007bff;
            text-decoration: none;
            word-break: break-word;
          }

          .sqaaf-guide strong {
            color: #000;
          }

          @media (max-width: 480px) {
            .sqaaf-guide {
              margin: 10px;
              padding: 15px;
              border-radius: 12px;
            }

            .sqaaf-guide h2 {
              font-size: 1.2rem;
            }

            .sqaaf-guide ol {
              font-size: 0.95rem;
              padding-left: 1em;
            }
          }
        </style>
      </head>
      <body>
        <h2>📁 SQAAF Folder Utility Web App</h2>

        <!-- Feature 1: Create SQAAF -->
        <h3>1️⃣ Create SQAAF Folder Structure</h3>
        <button onclick="createFolders()" id="btn1">✅ Create SQAAF Folders</button>
        <p id="status1"></p>

        <!-- Feature 2: Share existing folder -->
        <hr>
        <h3>2️⃣ Share an Existing Folder with Everyone</h3>
        <input type="text" id="shareId" placeholder="Paste your folder link or ID">
        <br>
        <button onclick="shareFolder()" id="btn2">🔗 Make Folder Public (View Only)</button>
        <p id="status2"></p>

        <!-- Feature 3: Clone a shared folder -->
        <hr>
        <h3>3️⃣ Clone a Shared Folder to Your Drive</h3>
        <input type="text" id="cloneId" placeholder="Paste shared folder link or ID">
        <br>
        <button onclick="cloneFolder()" id="btn3">📥 Clone to My Drive</button>
        <p id="status3"></p>

        <div class="sqaaf-guide">
          <h2>तुमच्या होम स्क्रीनवर SQAAF अ‍ॅप कसे तयार करावे? 📱</h2>
            <ol>
              <li>🌐 Sqaaf वेबसाईट उघडा (<a href="https://scert-data.web.app/" target="_blank">https://scert-data.web.app/</a>) आणि खालील प्रमाणे क्रिया (steps) फॉलो करा.</li>
              <li>वेबसाईट Chrome मध्ये उघडल्यावर, वर उजव्या कोपऱ्यातील <strong>⁝</strong> (३ dots) वर click करा.</li>
              <li><strong>“Add to Home screen”</strong> वर click करा.</li>
              <li>आता एक box येईल त्यात <strong>SQAAF</strong> असे लिहा किंवा Type करा ✏️.</li>
              <li><strong>Add</strong> किंवा <strong>Install</strong> वर click करा.</li>
              <li>अभिनंदन 🎉! <strong>SQAAF APP</strong> आता तुमच्या होम स्क्रीनवर अ‍ॅप म्हणून जोडले गेले आहे 🚀.</li>
            </ol>
        </div>
        <footer style="text-align: center; padding: 1rem; background-color: #f1f1f1;">
        <p>&copy; 2025 Ranjeet Kawade Sir. All rights reserved.</p>
        </footer>

        <script>
          function createFolders() {
            const btn = document.getElementById("btn1");
            const status = document.getElementById("status1");
            btn.disabled = true;
            status.innerText = "⏳ Creating folders please wait for 2-3 minutes...";
            google.script.run.withSuccessHandler(msg => {
              status.innerText = msg;
              btn.disabled = false;
            }).withFailureHandler(e => {
              status.innerText = "❌ " + e.message;
              btn.disabled = false;
            }).createSQAAFFolders();
          }

          function shareFolder() {
            const id = document.getElementById("shareId").value.trim().match(/[-\\w]{25,}/)?.[0];
            const btn = document.getElementById("btn2");
            const status = document.getElementById("status2");
            if (!id) return status.innerText = "❌ Invalid folder ID or link!";
            btn.disabled = true;
            status.innerText = "⏳ Sharing folder please wait...";
            google.script.run.withSuccessHandler(msg => {
              status.innerHTML = msg;
              btn.disabled = false;
            }).withFailureHandler(e => {
              status.innerText = "❌ " + e.message;
              btn.disabled = false;
            }).shareExistingFolder(id);
          }

          function cloneFolder() {
            const id = document.getElementById("cloneId").value.trim().match(/[-\\w]{25,}/)?.[0];
            const btn = document.getElementById("btn3");
            const status = document.getElementById("status3");
            if (!id) return status.innerText = "❌ Invalid folder ID or link!";
            btn.disabled = true;
            status.innerText = "⏳ Cloning folder please wait for 2-3 minutes but time depends on size of folder.";
            google.script.run.withSuccessHandler(msg => {
              status.innerHTML = msg;
              btn.disabled = false;
            }).withFailureHandler(e => {
              status.innerText = "❌ " + e.message;
              btn.disabled = false;
            }).cloneFolderStructure(id);
          }
        </script>
      </body>
    </html>
  `);
}

// Feature 1: Create standard SQAAF folder
function createSQAAFFolders() {
  const parentName = "SQAAF";
  let parent = DriveApp.getFoldersByName(parentName).hasNext()
    ? DriveApp.getFoldersByName(parentName).next()
    : DriveApp.createFolder(parentName);
  parent.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  for (let i = 1; i <= 128; i++) {
    const name = "मानक क्र. " + i;
    if (!parent.getFoldersByName(name).hasNext()) {
      const sub = parent.createFolder(name);
      sub.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }
  }
  return "✅ 'SQAAF' with 128 folders created.";
}

// Feature 2: Share an existing folder (and contents)
function shareExistingFolder(folderId) {
  const folder = DriveApp.getFolderById(folderId);
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  shareAllSubfoldersAndFiles(folder);
  return "✅ Folder and contents shared!<br>🔗 <a href='" + folder.getUrl() + "' target='_blank'>Open Folder</a>";
}

function shareAllSubfoldersAndFiles(folder) {
  const files = folder.getFiles();
  while (files.hasNext()) files.next().setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const folders = folder.getFolders();
  while (folders.hasNext()) {
    const sub = folders.next();
    sub.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    shareAllSubfoldersAndFiles(sub);
  }
}

// Feature 3: Clone any shared folder into user's own Drive
function cloneFolderStructure(folderId) {
  const source = DriveApp.getFolderById(folderId);
  const dest = DriveApp.getRootFolder().createFolder(source.getName() + " (Copy)");
  copyFolderContents(source, dest);
  return "✅ Folders cloned!<br>🔗 <a href='" + dest.getUrl() + "' target='_blank'>Open Cloned Folder In Your Google Drive App</a>";
}

function copyFolderContents(source, destination) {
  const files = source.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    file.makeCopy(file.getName(), destination);
  }


  const folders = source.getFolders();
  while (folders.hasNext()) {
    const sub = folders.next();
    const newSub = destination.createFolder(sub.getName());
    copyFolderContents(sub, newSub);
  }
}
