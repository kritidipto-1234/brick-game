const rulesBtn=document.querySelector('.rulesBtn');
const rulesList=document.querySelector('.ruleList');
const overlay=document.querySelector('.overlay');
/////////////////////////////////////////////////////////////////////////////

rulesBtn.addEventListener('click',function()
{
    overlay.style.display='flex';
    rulesList.style.display='flex';
});

overlay.addEventListener('click',function()
{
    overlay.style.display='none';
    rulesList.style.display='none';
});