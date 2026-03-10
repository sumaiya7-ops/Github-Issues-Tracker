let allData = [];
const container = document.getElementById('issue-container');
const spinner = document.getElementById('spinner');
const countElement = document.getElementById('count');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

async function loadData() {
    spinner.classList.remove('hidden');
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        allData = await res.json();
        renderCards(allData);
    } catch (err) {
        alert("Data load failed!");
        console.error(err);
    } finally {
        spinner.classList.add('hidden');
    }
}


function renderCards(apiResponse) {

    const issues = Array.isArray(apiResponse) ? apiResponse : (apiResponse.data || []);
    
    container.innerHTML = '';
    countElement.innerText = issues.length; 
    if (issues.length === 0) {
        container.innerHTML = '<p class="text-center col-span-full py-10 text-gray-400">No issues found.</p>';
        return;
    }

    issues.forEach(item => {
           const isClosed = item.status.toLowerCase() === 'closed';
        const statusIcon = isClosed ?  'B13-A5-Github-Issue-Tracker/assets/Closed- Status .png'  : 'B13-A5-Github-Issue-Tracker/assets/Open-Status.png';
        const borderColor = isClosed ? 'border-t-purple-600' : 'border-t-green-500';
  
    const labelsHtml = (item.labels || []).map(label => {
    const labelLower = label.toLowerCase();
    let colorClass = "border-blue-200 text-blue-600 bg-blue-50"; 
    let iconClass = "fa-tag"; 

    if (labelLower === 'bug') {
        colorClass = "text-red-500 border-red-200 bg-red-50";
        iconClass = "fa-bug";
    } else if (labelLower === 'help wanted') {
        colorClass = "border-amber-200 text-amber-600 bg-amber-50"; 
        iconClass = "fa-life-ring";
    } else if (labelLower === 'enhancement') {
        colorClass = "text-emerald-500 border-emerald-200 bg-emerald-50";
        iconClass = "fa-star"; 
    } else if (labelLower === 'documentation') {
        colorClass = "border-pink-200 text-pink-500 bg-pink-100";
        iconClass = "fa-book";
    } else if (labelLower === 'good first issue') {
        colorClass = "border-indigo-200 text-indigo-600 bg-indigo-50";
        iconClass = " fa-seedling";
    }

    return `
        <span class="text-[9px] font-bold border ${colorClass} px-2 py-0.5 rounded flex items-center gap-1 uppercase">
            <i class="fa-solid ${iconClass}"></i> ${label}
        </span>
      `;    
     }).join('');

         
          const priority = item.priority ? item.priority.toLowerCase() : '';
         let priorityClass = "text-gray-500 bg-gray-50"; 
        if (priority === 'high') {
        priorityClass = "text-red-400 bg-red-50";
        } else if (priority === 'medium') {
        priorityClass = "text-amber-500 bg-amber-100";
        } else if (priority === 'low') {
       priorityClass = "text-gray-400 bg-gray-100";
       }
  
    const card = `
        <div onclick="openIssueModal('${item.id}')" class="border ${borderColor} border-t-4 p-4 rounded-xl hover:shadow-lg cursor-pointer bg-white transition shadow-sm h-full flex flex-col justify-between">
            <div>
                <div class="flex justify-between items-start mb-2">
                    <span class="w-5 h-5"><img src="${statusIcon}" class="w-full"></span>
                    <span class="text-[10px] font-bold ${priorityClass} px-4 py-1 rounded-2xl uppercase">${item.priority || 'N/A'}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-800 mb-1 line-clamp-1">${item.title}</h4>
                <p class="text-[11px] text-gray-500 line-clamp-2 mb-4">${item.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${labelsHtml}
                </div>
              </div>
                  <div class="border-t pt-2 text-[10px] text-gray-400">
                  <p class="font-semibold text-gray-600">by ${item.author || 'Anonymous'}</p>
                  <p>${item.createdAt ? new Date(item.createdAt).toDateString() : ''}</p>
                  </div>
              </div>`;
            container.innerHTML += card;
         });
       }              

       const searchBox = document.getElementById("searchBox");
     const icon = document.createElement("span");
     icon.innerHTML = '<i class="fas fa-search text-gray-400"></i>';
     icon.className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none";
    if (searchBox) {   
    searchBox.prepend(icon); 
    }

    async function loadData() {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.classList.remove('hidden');

    try {
        const res = await fetch('https://vercel.app');
        const data = await res.json();
         allData = data.data || data; 
         renderCards(allData);
       } catch (err) {
           console.error("Data load failed!", err);
       } finally {
         if (spinner) spinner.classList.add('hidden');
      }
    }

    const searchInput = document.getElementById("searchInput");

   if (searchInput) {
      searchInput.addEventListener("input", () => {
         const query = searchInput.value.trim().toLowerCase();
        const issues = Array.isArray(allData) ? allData : (allData.data || []);
        const filteredIssues = issues.filter(issue => {
            const title = (issue.title || "").toLowerCase();
            const description = (issue.description || "").toLowerCase();
            
            return title.includes(query) || description.includes(query);
        });
        renderCards(filteredIssues);
    });
   }
   loadData();

   async function openIssueModal(issueId) {
      try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
        const response = await res.json();
        const issue = response.data;

        if (!issue) return;
        document.getElementById('m-title').innerText = issue.title;     
        document.getElementById('m-status').innerText = issue.status.toUpperCase();
        document.getElementById('m-author').innerText = issue.opened_by;
        document.getElementById('m-date').innerText = new Date(issue.createdAt).toDateString();

   
        const labelsContainer = document.getElementById('m-labels');
        if (labelsContainer) {
            labelsContainer.innerHTML = ''; 
            (issue.labels || []).forEach(label => {
                const span = document.createElement('span');
                span.className = "text-[10px] font-bold border px-2 py-0.5 rounded-full flex items-center gap-1 uppercase mr-2 mb-1";
                let color = "text-gray-500 bg-gray-100 border-gray-300";
                let icon = "fa-tag";
                if (label.toLowerCase() === 'bug') { color="text-red-500 bg-red-50 border-red-200"; icon="fa-bug"; }
                else if (label.toLowerCase() === 'help wanted') { color="text-amber-500 bg-amber-50 border-amber-200"; icon="fa-life-ring"; }
                else if (label.toLowerCase() === 'enhancement') { color="text-green-500 bg-green-50 border-green-200"; icon="fa-star"; }
                span.className += ' ' + color;
                span.innerHTML = `<i class="fa-solid ${icon}"></i> ${label}`;
                labelsContainer.appendChild(span);
            });
        }
        document.getElementById('m-desc').innerText = issue.description;      
        document.getElementById('m-assignee').innerText = issue.assignee || "Not Assigned"; 
        const priorityEl = document.getElementById('m-priority');
        priorityEl.innerText = issue.priority ? issue.priority.toUpperCase() : "N/A";

        if(issue.priority) {
            if(issue.priority.toLowerCase() === 'high') priorityEl.style.backgroundColor = "#EF4444";
            else if(issue.priority.toLowerCase() === 'medium') priorityEl.style.backgroundColor = "#FBBF24";
            else if(issue.priority.toLowerCase() === 'low') priorityEl.style.backgroundColor = "#3B82F6";
        } else {
            priorityEl.style.backgroundColor = "#6B7280";

        }
        document.getElementById('issue_modal').showModal();

    } catch (err) {
        console.error("Error loading issue:", err);
    }
}

function filterIssues(type, btn) {
  
    const allButtons = document.querySelectorAll('#tabContainer button');
    allButtons.forEach(button => {
        button.classList.remove('bg-purple-600', 'text-white');
        button.classList.add('bg-white', 'text-gray-600');
    });

    btn.classList.add('bg-purple-600', 'text-white');
    btn.classList.remove('bg-white', 'text-gray-600');
    const issues = Array.isArray(allData) ? allData : (allData.data || []);
    if (type === 'all') {
        renderCards(issues);
    } else {
        const filtered = issues.filter(i => i.status.toLowerCase() === type.toLowerCase());
        renderCards(filtered);
    }
}

    async function loadData() {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.classList.remove('hidden');

    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const result = await res.json();  
        allData = Array.isArray(result) ? result : (result.data || []);        
        renderCards(allData);
  
        const allBtn = document.querySelector('button[onclick*="all"]');
        if (allBtn) {
            allBtn.classList.add('bg-purple-600', 'text-white');
            allBtn.classList.remove('bg-white', 'text-gray-600');
        }
    } catch (err) {
        console.error("ডাটা লোড হয়নি:", err);
    } finally {
        if (spinner) spinner.classList.add('hidden');
    }
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

window.onload = loadData;

window.showSingleIssue = showModalDetails;