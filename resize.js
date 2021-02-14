const body=document.querySelector('body');
const wrapper=document.querySelector('.wrapper');
const canvasElement=document.querySelector('canvas');
const buttons=document.querySelector('.buttons');

window.addEventListener('load',function()
{
    console.log(canvasElement.scrollHeight,canvasElement.scrollWidth);
    console.log(canvasElement.offsetHeight,canvasElement.offsetWidth);
    if (body.offsetHeight<body.scrollHeight)//scrollbar present
    {
        wrapper.style.transform='scale(0.75)';
        //canvasElement.style.position='fixed';
        wrapper.style.position='relative';
        wrapper.style.top='-60px';
    }
})