var cloudMoved = false;
var cloud2Moved = false;
var cloud3Moved = false;
var cloud4Moved = false;
var cloud5Moved = false;
$(init);
function init() {
	cloudMove();
	cloud2Move();
	cloud3Move();
	cloud4Move();
	cloud5Move();
}
function cloudMove() {
	if (!cloudMoved) {
		$("#cloud1")
			.css("left", $("#cloud1").offset().left)
	}
	$("#cloud1").animate(
			{left: $("#sky").width()},
			cloudMoved ? 180000 : 150000, "linear",
			function() {
				$(this).css("left", -parseInt($(this).css("width")));
				cloudMoved = true; cloudMove();
			}
		);
}
function cloud2Move() {
	if (!cloud2Moved) { $("#cloud2").css("left", $("#cloud2").offset().left); }
	$("#cloud2").animate(
			{left: $("#sky").width()},
			cloud2Moved ? 120000 : 60000, "linear",
			function() {
				$(this).css("left", -parseInt($(this).css("width")));
				cloud2Moved = true; cloud2Move();
			}
		)
}
function cloud3Move() {
	if (!cloud3Moved) { $("#cloud3").css("left", $("#cloud3").offset().left); }
	$("#cloud3")
		.animate(
			{left: $("#sky").width()},
			cloud3Moved ? 400000 : 150000, "linear",
			function() {
				$(this).css("left", -parseInt($(this).css("width")));
				cloud3Moved = true; cloud3Move();
			}
		)
}
function cloud4Move() {
	if (!cloud4Moved) { $("#cloud4").css("left", $("#cloud4").offset().left); }
	$("#cloud4").animate(
			{left: $("#sky").width()},
			cloud4Moved ? 400000 : 250000, "linear",
			function() {
				$(this).css("left", -parseInt($(this).css("width")));
				cloud4Moved = true; cloud4Move();
			}
		)
}
function cloud5Move() {
	if (!cloud5Moved) { $("#cloud5").css("left", $("#cloud5").offset().left); }
	$("#cloud5")
		.animate(
			{left: $("#sky").width()},
			cloud3Moved ? 400000 : 500000, "linear",
			function() {
				$(this).css("left", -parseInt($(this).css("width")));
				cloud5Moved = true; cloud5Move();
			}
		)
}