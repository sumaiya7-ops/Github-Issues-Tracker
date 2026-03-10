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
