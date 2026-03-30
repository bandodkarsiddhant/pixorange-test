// fetch("./templates/nav.html").then((res) => res.text()).then((html) => {
// document.getElementById("nav-placeholder").innerHTML = html;
// });

$('#nav-placeholder').load('./templates/nav.html');
$('#featured-landing-wrapper').load('./templates/featuredLanding.html');