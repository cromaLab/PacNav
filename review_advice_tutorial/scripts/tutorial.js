var instructions = document.getElementById("tutorialMessages");
var tutorial;
var next = false;
var mistakeNum = 0;

var tutorialMessage = 0;
var tutorialMessages = [
"In this study, you will watch a video with respect to a pac-man playing a game, and you will need to point out the time that the pac-man is making a mistake. There's only one mistake in each video. <br /><br />Click the screen to continue",
"Click the Play button to watch the video. Remember that you can watch the video multiple times.",
"If you think the pac-man is making a mistake, click Wait button and step back and forward to find the exact time that the pac-man is making a mistake. If the video ends, click Replay button to watch it again. <br /><br />Click Wait or Replay button to continue",
"You can click Replay button to watch the video again to find the mistake time. <br /><br /> Click Replay button to continue",
"After you find the exact mistake time, please click Mistake button to give your suggestion. <br /><br />Click Mistake button to continue",
"You have made the wrong suggestion over three times. PacMan makes a mistake at roughly 5.50. Please step to time 5.50 and identify that a mistake was made.",
"PacMan has not made any mistakes yet! <br /> Please continue watching the video to find the mistake.",
"PacMan has already made a mistake. <br />  Please replay the video or step back to find the time of the mistake.",
"Good job! You just gave the correct suggestion. The pac-man did make a mistake at that time! <br /><br />Click the screen to continue",
"Now you can start to do the real task to find the time that the pacman is making a mistake! <br /><br />Click the screen to continue"
];

initiate();

function initiate(){
	if(sessionStorage.getItem("task")){
		console.log("NO TUTORIAL");
		instructions.innerHTML = "";
		return;
	}else{
		window.addEventListener("click", mouseClicked, false);
		tutorialSetup();
	}
}

function tutorialSetup(){
	console.log("tutorial setup");
	//disable play and submit buttons
	$("#play").prop('disabled', true);
	$("#submitButton").prop('disabled', true);
	instructions.innerHTML = tutorialMessages[0];
	tutorial = tutorialStart;
}

function tutorialStart(){
	console.log("tutorial start");
    $("#play").prop('disabled', false);
	$("#submitButton").prop('disabled', true);
	tutorial = tutorialWait;
	highlight("play");
	instructions.innerHTML = tutorialMessages[1];
	
	sessionStorage.setItem("play", true);
}

function tutorialWait(){
	console.log("tutorial wait");
    if(signal == "PLAY"){	// after clicking the play button
    	console.log("tutorial wait signal play");
		$("#submitButton").prop('disabled', true);
		tutorial = tutorialMistake;
		highlight("play");
		instructions.innerHTML = tutorialMessages[2];
		instructions.style.top = "550px";
    }
    else if(signal == "STEP" || signal == "MISTAKE"){
    	console.log("wait mistake");
    	tutorial = tutorialAnswer;
    }
}

function tutorialMistake(){
	console.log("tutorial mistake");
	console.log("SIGNAL: " + signal);
    if(signal == "WAIT"){	// after clicking the wait button
		$("#submitButton").prop('disabled', true);
		tutorial = tutorialAnswer;
		highlight("mistake");
		instructions.innerHTML = tutorialMessages[4];
		instructions.style.top = "615px";
    }
}

function tutorialAnswer(){
	console.log("tutorial answer");
	
    if(signal == "MISTAKE"){
    	console.log("BEI SIGNAL MISTAKE!!!");
    	$("#submitButton").prop('disabled', true);
		var time = timeSec + '.' + timeFrac;
		time = parseFloat(time);
		
		if(time >= 5.50 && time <= 5.54){
			console.log("CORRECT MISTAKE TIME");
			tutorialMessage = tutorialMessages.length - 2;
			$('#play').hide();
        	$('#stepf').hide();
        	$('#stepb').hide();
        	$('#jumpf').hide();
        	$('#jumpb').hide();
    		$('#inputContainer').hide(200);
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			instructions.style.top = "550px";
			tutorial = tutorialFinish;
		}else{
			console.log("WRONG MISTAKE TIME");
			console.log("mistakeNum: " + mistakeNum);
			if(mistakeNum < 3){
				if(time < 5.50){
					tutorialMessage = tutorialMessages.length - 4;
				}else if(time > 5.54){
					tutorialMessage = tutorialMessages.length - 3;
				}
			}else{
				tutorialMessage = tutorialMessages.length - 5;
			}
			
			instructions.innerHTML = tutorialMessages[tutorialMessage];
			tutorial = tutorialWait;
			mistakeNum++;
		}
		
	}
	else if(signal == "PLAY"){	// after clicking the continue button   	
		$("#submitButton").prop('disabled', true);
		tutorial = tutorialMistake;
		highlight("play");	
		instructions.innerHTML = tutorialMessages[2];
    	instructions.style.top = "550px";
	}
}

function tutorialFinish(){
    if(next){
    	$("#submitButton").prop('disabled', true);
    	++tutorialMessage;
		instructions.innerHTML = tutorialMessages[tutorialMessage];
		tutorial = taskStart;
	}
}

function taskStart(){
	if(next){
		$("#submitButton").prop('disabled', true);
		$('.suggestEntry').empty();		// clear the suggestion content
		instructions.innerHTML = "";
		
		var videoPath = document.getElementById("vidPlayer").src;
		var vidId = gup('video');

 		console.log("vidId: " + vidId);
 		console.log("videoPath: " + videoPath);
 		//videoPath = changeUrl(videoPath, vidId);
 		//document.getElementById("vidPlayer").src = videoPath;
		
		var url = window.location.href;
		console.log("url: " + url);
		sessionStorage.setItem("task", true);
 		window.location = url.slice(0, -11) + vidId;
 		
 		tutorial = finish;
	}
}

function finish(){
	console.log("finish");
}

function update(){
	console.log("in update");
	tutorial();
	next = false;
}

function mouseClicked(e){
    next = true;
    update();
}


//Highlighting

var isHighlight = false;
var htarget = null;
var hstep = 0;
var highlightTemp = 0;

function highlight(target){
    if(htarget != null)
	htarget.style.opacity = highlightTemp;
		
    hstep = 0;
    htarget = document.getElementById(target);
    highlightTemp = htarget.style.opacity;

    if(!isHighlight)
	setTimeout(highlightUpdate, 50);
	
    isHighlight = true;
}

function noHighlight(){
    if(htarget != null)
	htarget.style.opacity = highlightTemp;

    isHighlight = false;
    htarget = null;
}

function highlightUpdate(){
    if(isHighlight){
	htarget.style.opacity = 0.4*(Math.sin(hstep) + 1);
	hstep += 0.15;
	setTimeout(highlightUpdate, 50);
    }
}