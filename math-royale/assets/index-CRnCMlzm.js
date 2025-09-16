(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const x="modulepreload",C=function(o){return"/math-royale/"+o},k={},B=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),a=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));i=Promise.allSettled(t.map(d=>{if(d=C(d),d in k)return;k[d]=!0;const c=d.endsWith(".css"),u=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${u}`))return;const h=document.createElement("link");if(h.rel=c?"stylesheet":x,c||(h.as="script"),h.crossOrigin="",h.href=d,a&&h.setAttribute("nonce",a),document.head.appendChild(h),c)return new Promise((y,p)=>{h.addEventListener("load",y),h.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(n){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=n,window.dispatchEvent(a),!a.defaultPrevented)throw n}return i.then(n=>{for(const a of n||[])a.status==="rejected"&&r(a.reason);return e().catch(r)})},S={BASIC:"basic",DECIMAL:"decimal",PERCENTAGE:"percentage",PERCENTAGE_CHANGE:"percentage_change"},M={basic:.35,decimal:.3,percentage:.2,percentage_change:.15};function m(o,e){return Math.floor(Math.random()*(e-o+1))+o}function L(o){return o[Math.floor(Math.random()*o.length)]}function q(o){const e=Object.entries(o),t=e.reduce((i,[r,n])=>i+n,0);let s=Math.random()*t;for(const[i,r]of e)if(s-=r,s<=0)return i;return e[e.length-1][0]}function g(o){return Number.isInteger(o)?o.toString():parseFloat(o.toPrecision(12)).toString()}function v(o){return parseFloat(o.toPrecision(12))}function w(o=[0,0]){const e=m(1,13),t=m(1,13),s=m(o[0],o[1]),i=m(o[0],o[1]),r=e*Math.pow(10,s),n=t*Math.pow(10,i),a=r*n;return{question:`${g(r)} × ${g(n)}`,answer:v(a),type:s===0&&i===0?S.BASIC:S.DECIMAL,metadata:{base:[e,t],shifts:[s,i],operation:"multiply"}}}function N(o=[0,1]){const t=L([1,2,3,4,5,6,7,8,9,10,11,12,13,20,30,40,50,60,70,80,90,100,110,120,130]),s=m(1,13),i=m(o[0],o[1]),r=s*Math.pow(10,i),n=t/100*r;return{question:`What is ${g(t)}% of ${g(r)}?`,answer:v(n),type:S.PERCENTAGE,metadata:{percentage:t,base:s,shift:i,operation:"percentage"}}}function P(){const o=Math.random()<.5;let e;o?e=L([10,20,30]):e=m(1,9)*10;const t=m(1,13),s=Math.random()<.5?0:1,i=t*Math.pow(10,s),r=o?1+e/100:1-e/100,n=i*r;return{question:`What is ${e}% ${o?"more":"less"} than ${g(i)}?`,answer:v(n),type:S.PERCENTAGE_CHANGE,metadata:{base:t,shift:s,percentage:e,isIncrease:o,operation:"percentage_change"}}}function T(o={}){const{weights:e=M,decimalShiftRange:t=[-2,2]}=o;switch(q(e)){case"basic":return w([0,0]);case"decimal":return w(t);case"percentage":return N();case"percentage_change":return P();default:return w([0,0])}}class Q{constructor(){this.reset()}reset(){this.questions=[],this.currentQuestion=null,this.questionStartTime=null,this.sessionStartTime=null,this.currentStreak=0,this.bestStreak=0,this.isActive=!1,this.isPausedState=!1}start(){this.reset(),this.isActive=!0,this.sessionStartTime=Date.now()}startQuestion(e){this.isActive||this.start(),this.currentQuestion={...e,startTime:Date.now(),userAnswer:null,isCorrect:null,responseTime:null},this.questionStartTime=Date.now()}submitAnswer(e){if(!this.currentQuestion)throw new Error("No question is currently active");const t=Date.now()-this.questionStartTime,s=parseFloat(e),i=Math.abs(s-this.currentQuestion.answer)<.01;this.currentQuestion.userAnswer=s,this.currentQuestion.isCorrect=i,this.currentQuestion.responseTime=t,this.questions.push({...this.currentQuestion}),i?(this.currentStreak++,this.bestStreak=Math.max(this.bestStreak,this.currentStreak)):this.currentStreak=0;const r={isCorrect:i,correctAnswer:this.currentQuestion.answer,responseTime:t};return this.currentQuestion=null,this.questionStartTime=null,r}getStatistics(){const e=this.questions.length;if(e===0)return{totalQuestions:0,correctAnswers:0,accuracy:0,averageTime:0,currentStreak:0,bestStreak:0,sessionDuration:0,questionsByType:{},accuracyByType:{}};const t=this.questions.filter(c=>c.isCorrect).length,s=t/e*100,r=this.questions.reduce((c,u)=>c+u.responseTime,0)/e,n={},a={};this.questions.forEach(c=>{n[c.type]||(n[c.type]=0,a[c.type]={correct:0,total:0}),n[c.type]++,a[c.type].total++,c.isCorrect&&a[c.type].correct++}),Object.keys(a).forEach(c=>{const{correct:u,total:h}=a[c];a[c]=h>0?u/h*100:0});const d=this.sessionStartTime?Date.now()-this.sessionStartTime:0;return{totalQuestions:e,correctAnswers:t,accuracy:Math.round(s*10)/10,averageTime:Math.round(r/100)/10,currentStreak:this.currentStreak,bestStreak:this.bestStreak,sessionDuration:d,questionsByType:n,accuracyByType:a}}getHistory(){return[...this.questions]}getRecentQuestions(e=5){return this.questions.slice(-e)}isSessionActive(){return this.isActive}pause(){this.isActive&&(this.isPausedState=!0)}resume(){this.isActive&&this.isPausedState&&(this.isPausedState=!1)}isPaused(){return this.isPausedState}end(){return this.isActive=!1,this.isPausedState=!1,this.getStatistics()}getPerformanceTrend(e=10){if(this.questions.length<e)return null;const s=this.questions.slice(-e).filter(a=>a.isCorrect).length/e*100,i=this.questions.slice(-e*2,-e);if(i.length<e)return{trend:"stable",recentAccuracy:s};const r=i.filter(a=>a.isCorrect).length/e*100;let n="stable";return s>r+10?n="improving":s<r-10&&(n="declining"),{trend:n,recentAccuracy:Math.round(s),olderAccuracy:Math.round(r)}}exportData(){return{questions:this.questions,currentStreak:this.currentStreak,bestStreak:this.bestStreak,sessionStartTime:this.sessionStartTime,isActive:this.isActive}}importData(e){this.questions=e.questions||[],this.currentStreak=e.currentStreak||0,this.bestStreak=e.bestStreak||0,this.sessionStartTime=e.sessionStartTime||null,this.isActive=e.isActive||!1,this.currentQuestion=null,this.questionStartTime=null}}const R=new Q;class A{constructor(){this.initializeElements(),this.feedbackTimeout=null}initializeElements(){const e=typeof document<"u"?document:globalThis.document;if(!e){console.warn("Document not available for UIController");return}this.questionText=e.getElementById("questionText"),this.questionDisplay=e.getElementById("questionDisplay"),this.answerInput=e.getElementById("answerInput"),this.feedback=e.getElementById("feedback"),this.questionsCount=e.getElementById("questionsCount"),this.accuracyRate=e.getElementById("accuracyRate"),this.avgTime=e.getElementById("avgTime"),this.currentStreak=e.getElementById("currentStreak"),this.resetBtn=e.getElementById("resetBtn"),this.modeSelector=e.getElementById("modeSelector"),this.startPracticeBtn=e.getElementById("startPracticeBtn"),this.startSprintBtn=e.getElementById("startSprintBtn"),this.questionSection=e.querySelector(".question-section"),this.answerSection=e.querySelector(".answer-section"),this.statsSection=e.querySelector(".stats-section"),this.controlsSection=e.querySelector(".controls-section");const s=["questionText","answerInput","feedback","questionsCount","accuracyRate","avgTime","currentStreak","resetBtn"].filter(i=>!e.getElementById(i));s.length>0&&console.error("Missing required elements:",s)}displayQuestion(e){if(!e||!e.question){console.error("Invalid question object:",e);return}this.questionText.textContent=e.question,this.answerInput.value="",this.answerInput.disabled=!1,this.answerInput.focus()}showFeedback(e,t=null){this.feedbackTimeout&&clearTimeout(this.feedbackTimeout),this.feedback.className="feedback",e?(this.feedback.textContent="✓ Correct!",this.feedback.classList.add("feedback-correct"),this.questionDisplay.classList.add("pulse"),setTimeout(()=>{this.questionDisplay.classList.remove("pulse")},600)):(this.feedback.textContent=`✗ Incorrect. Answer: ${t}`,this.feedback.classList.add("feedback-incorrect"),this.answerInput.classList.add("shake"),setTimeout(()=>{this.answerInput.classList.remove("shake")},300)),this.feedbackTimeout=setTimeout(()=>{this.clearFeedback()},e?4e3:5e3)}clearFeedback(){this.feedback.textContent="",this.feedback.className="feedback",this.feedbackTimeout&&(clearTimeout(this.feedbackTimeout),this.feedbackTimeout=null)}updateStatistics(e){e&&(this.animateValue(this.questionsCount,e.totalQuestions),this.animateValue(this.accuracyRate,`${e.accuracy}%`),this.animateValue(this.avgTime,`${e.averageTime}s`),this.animateValue(this.currentStreak,e.currentStreak),e.currentStreak>0&&e.currentStreak%5===0&&this.celebrateStreak(e.currentStreak))}animateValue(e,t){e.textContent!==t.toString()&&(e.style.transform="scale(1.2)",e.textContent=t,setTimeout(()=>{e.style.transform="scale(1)"},200))}celebrateStreak(e){const t=this.currentStreak.parentElement;t.classList.add("pulse"),this.feedback.textContent||(this.feedback.textContent=`🔥 ${e} streak!`,this.feedback.className="feedback feedback-correct",setTimeout(()=>{this.feedback.textContent===`🔥 ${e} streak!`&&this.clearFeedback()},2e3)),setTimeout(()=>{t.classList.remove("pulse")},600)}setGameActive(e,t="practice"){e?(this.hideModeSelector(),this.showGameSections(),t==="practice"?this.showStatsSection():this.hideStatsSection(),this.resetBtn&&(this.resetBtn.textContent=t==="sprint"?"Stop Sprint":"Reset"),this.answerInput.disabled=!1,this.answerInput.focus(),this.resetBtn&&(this.resetBtn.disabled=!1)):(this.showModeSelector(),this.hideGameSections(),this.answerInput.disabled=!0,this.answerInput.value="",this.questionText.textContent="Choose a mode to begin!",this.clearFeedback())}showModeSelector(){this.modeSelector&&(this.modeSelector.style.display="block")}hideModeSelector(){this.modeSelector&&(this.modeSelector.style.display="none")}showGameSections(){this.questionSection&&(this.questionSection.style.display="block"),this.answerSection&&(this.answerSection.style.display="block"),this.controlsSection&&(this.controlsSection.style.display="block")}hideGameSections(){this.questionSection&&(this.questionSection.style.display="none"),this.answerSection&&(this.answerSection.style.display="none"),this.controlsSection&&(this.controlsSection.style.display="none"),this.statsSection&&(this.statsSection.style.display="none")}showStatsSection(){this.statsSection&&(this.statsSection.style.display="block")}hideStatsSection(){this.statsSection&&(this.statsSection.style.display="none")}reset(){this.setGameActive(!1),this.clearFeedback(),this.questionsCount.textContent="0",this.accuracyRate.textContent="--%",this.avgTime.textContent="--s",this.currentStreak.textContent="0",document.querySelectorAll(".pulse, .shake").forEach(t=>{t.classList.remove("pulse","shake")})}getAnswer(){return this.answerInput?this.answerInput.value.trim():""}clearAnswer(){this.answerInput&&(this.answerInput.value="",this.answerInput.focus())}showLoading(){this.questionText&&(this.questionText.classList.add("loading"),this.questionText.textContent="")}hideLoading(){this.questionText&&this.questionText.classList.remove("loading")}showError(e){this.feedback.textContent=`⚠️ ${e}`,this.feedback.className="feedback feedback-incorrect"}on(e,t,s){e&&e.addEventListener(t,s)}off(e,t,s){e&&e.removeEventListener(t,s)}focusAnswer(){this.answerInput&&(this.answerInput.focus(),this.answerInput.select())}isAnswerFocused(){return document.activeElement===this.answerInput}flash(e){if(!e)return;e.style.transition="background-color 0.3s";const t=e.style.backgroundColor;e.style.backgroundColor="var(--primary-light)",setTimeout(()=>{e.style.backgroundColor=t},300)}updateButtonStates(e,t){this.resetBtn&&(this.resetBtn.disabled=!t)}showSessionSummary(e){const t=`
      Session Complete!
      Questions: ${e.totalQuestions}
      Accuracy: ${e.accuracy}%
      Best Streak: ${e.bestStreak}
      Avg Time: ${e.averageTime}s
    `;this.questionText&&(this.questionText.textContent=t.trim()),this.setGameActive(!1)}showKeyboardShortcuts(){const e=`
      Keyboard Shortcuts:
      Enter - Submit answer / Next question
      Escape - Reset session
      Space - Start/Next (when input not focused)
    `;this.feedback.textContent=e.trim(),this.feedback.className="feedback"}}class I{constructor(e="mathFluencyHighScores"){this.storageKey=e,this.maxScoresPerDuration=10,this.loadScores()}loadScores(){try{const e=localStorage.getItem(this.storageKey);this.scores=e?JSON.parse(e):this.getEmptyScores(),this.validateScores()}catch(e){console.error("Failed to load high scores:",e),this.scores=this.getEmptyScores()}}getEmptyScores(){return{"1min":[],"2min":[],"3min":[],"5min":[]}}validateScores(){["1min","2min","3min","5min"].forEach(t=>{Array.isArray(this.scores[t])||(this.scores[t]=[]),this.scores[t]=this.scores[t].filter(s=>s&&typeof s.name=="string"&&typeof s.score=="number"&&typeof s.questionsAnswered=="number"&&typeof s.accuracy=="number"&&s.date),this.scores[t].sort((s,i)=>i.score-s.score),this.scores[t]=this.scores[t].slice(0,this.maxScoresPerDuration)})}saveScores(){try{return localStorage.setItem(this.storageKey,JSON.stringify(this.scores)),!0}catch(e){return console.error("Failed to save high scores:",e),!1}}addScore(e,t){if(!["1min","2min","3min","5min"].includes(e))throw new Error(`Invalid duration: ${e}`);if(!t.name||typeof t.name!="string")throw new Error("Invalid name");if(typeof t.score!="number"||t.score<0)throw new Error("Invalid score");if(typeof t.questionsAnswered!="number"||t.questionsAnswered<0)throw new Error("Invalid questionsAnswered");if(typeof t.accuracy!="number"||t.accuracy<0||t.accuracy>100)throw new Error("Invalid accuracy");const s={name:t.name.trim(),score:Math.round(t.score),questionsAnswered:t.questionsAnswered,accuracy:Math.round(t.accuracy*10)/10,date:new Date().toISOString(),avgTimePerQuestion:t.avgTimePerQuestion||0};this.scores[e].push(s),this.scores[e].sort((r,n)=>n.score-r.score),this.scores[e]=this.scores[e].slice(0,this.maxScoresPerDuration),this.saveScores();const i=this.scores[e].findIndex(r=>r.name===s.name&&r.score===s.score&&r.date===s.date);return i>=0?i+1:null}getScores(e){if(!["1min","2min","3min","5min"].includes(e))throw new Error(`Invalid duration: ${e}`);return this.scores[e].map(t=>({...t}))}getAllScores(){return{"1min":this.scores["1min"].map(e=>({...e})),"2min":this.scores["2min"].map(e=>({...e})),"3min":this.scores["3min"].map(e=>({...e})),"5min":this.scores["5min"].map(e=>({...e}))}}isHighScore(e,t){var r;if(!["1min","2min","3min","5min"].includes(e))return!1;const s=this.scores[e];if(s.length<this.maxScoresPerDuration)return!0;const i=((r=s[s.length-1])==null?void 0:r.score)||0;return t>i}clearScores(e=null){if(e){if(!["1min","2min","3min","5min"].includes(e))throw new Error(`Invalid duration: ${e}`);this.scores[e]=[]}else this.scores=this.getEmptyScores();this.saveScores()}getTopScore(e){return["1min","2min","3min","5min"].includes(e)&&this.scores[e][0]||null}getPlayerBest(e,t=null){if(!e)return null;const s=e.trim().toLowerCase();if(t)return["1min","2min","3min","5min"].includes(t)&&this.scores[t].find(r=>r.name.toLowerCase()===s)||null;let i=null;return["1min","2min","3min","5min"].forEach(r=>{const n=this.scores[r].find(a=>a.name.toLowerCase()===s);n&&(!i||n.score>i.score)&&(i={...n,duration:r})}),i}exportData(){return{version:"1.0",exportDate:new Date().toISOString(),scores:this.getAllScores()}}importData(e){if(!e||!e.scores)throw new Error("Invalid import data");this.scores=e.scores,this.validateScores(),this.saveScores()}getStatistics(){const e={};return["1min","2min","3min","5min"].forEach(t=>{const s=this.scores[t];s.length===0?e[t]={totalGames:0,topScore:0,avgScore:0,avgAccuracy:0}:e[t]={totalGames:s.length,topScore:s[0].score,avgScore:Math.round(s.reduce((i,r)=>i+r.score,0)/s.length),avgAccuracy:Math.round(s.reduce((i,r)=>i+r.accuracy,0)/s.length*10)/10}}),e}}const f=new I,$=Object.freeze(Object.defineProperty({__proto__:null,HighScores:I,highScores:f},Symbol.toStringTag,{value:"Module"})),b={"1min":6e4,"2min":12e4,"3min":18e4,"5min":3e5},l={IDLE:"idle",READY:"ready",RUNNING:"running",PAUSED:"paused",FINISHED:"finished"};class D{constructor(){this.reset()}reset(){this.state=l.IDLE,this.duration=null,this.startTime=null,this.endTime=null,this.pausedTime=0,this.pauseStartTime=null,this.timeRemaining=0,this.questions=[],this.currentQuestion=null,this.questionStartTime=null,this.score=0,this.correctAnswers=0,this.totalAnswers=0,this.currentStreak=0,this.bestStreak=0,this.updateCallback=null,this.finishCallback=null,this.updateInterval=null}configure(e,t={}){if(!b[e])throw new Error(`Invalid duration: ${e}`);if(this.state!==l.IDLE)throw new Error("Cannot configure sprint while active");return this.duration=e,this.timeRemaining=b[e],this.updateCallback=t.onUpdate||null,this.finishCallback=t.onFinish||null,this.state=l.READY,!0}start(){if(this.state!==l.READY)throw new Error("Sprint not configured or already running");return this.state=l.RUNNING,this.startTime=Date.now(),this.nextQuestion(),this.updateInterval=setInterval(()=>{this.updateTimer()},100),!0}pause(){return this.state!==l.RUNNING?!1:(this.state=l.PAUSED,this.pauseStartTime=Date.now(),this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=null),!0)}resume(){return this.state!==l.PAUSED?!1:(this.pausedTime+=Date.now()-this.pauseStartTime,this.pauseStartTime=null,this.state=l.RUNNING,this.updateInterval=setInterval(()=>{this.updateTimer()},100),!0)}stop(){if(this.state===l.IDLE)return!1;this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=null);const e=this.state===l.RUNNING;return e&&(this.endTime=Date.now()),this.state=l.FINISHED,e&&this.finishCallback&&this.finishCallback(this.getResults()),!0}nextQuestion(){return this.state!==l.RUNNING?null:(this.currentQuestion=T(),this.questionStartTime=Date.now(),this.currentQuestion)}submitAnswer(e){if(this.state!==l.RUNNING||!this.currentQuestion)return null;const t=Date.now()-this.questionStartTime,s=parseFloat(e)===this.currentQuestion.answer,i={question:this.currentQuestion.question,userAnswer:e,correctAnswer:this.currentQuestion.answer,isCorrect:s,timeElapsed:t,type:this.currentQuestion.type};return this.questions.push(i),this.totalAnswers++,s?(this.correctAnswers++,this.currentStreak++,this.bestStreak=Math.max(this.bestStreak,this.currentStreak),this.score+=1):(this.currentStreak=0,this.score=Math.max(0,this.score-1)),{isCorrect:s,correctAnswer:this.currentQuestion.answer,points:s?1:-1,currentStreak:this.currentStreak,score:this.score}}updateTimer(){if(this.state!==l.RUNNING)return;const t=Date.now()-this.startTime-this.pausedTime;this.timeRemaining=Math.max(0,b[this.duration]-t),this.updateCallback&&this.updateCallback({timeRemaining:this.timeRemaining,score:this.score,questionsAnswered:this.totalAnswers}),this.timeRemaining<=0&&this.stop()}getTimeRemaining(){return this.timeRemaining}getFormattedTime(){const e=Math.ceil(this.timeRemaining/1e3),t=Math.floor(e/60),s=e%60;return`${t}:${s.toString().padStart(2,"0")}`}getProgress(){if(!this.duration)return 0;const e=b[this.duration];return(e-this.timeRemaining)/e*100}getStatistics(){const e=this.totalAnswers>0?Math.round(this.correctAnswers/this.totalAnswers*100):0,t=this.questions.length>0?Math.round(this.questions.reduce((s,i)=>s+i.timeElapsed,0)/this.questions.length):0;return{score:this.score,questionsAnswered:this.totalAnswers,correctAnswers:this.correctAnswers,accuracy:e,currentStreak:this.currentStreak,bestStreak:this.bestStreak,avgTimePerQuestion:t,timeElapsed:this.startTime?(this.endTime||Date.now())-this.startTime-this.pausedTime:0}}getResults(){if(this.state===l.IDLE)return null;const e=this.getStatistics();return{duration:this.duration,score:e.score,questionsAnswered:e.questionsAnswered,correctAnswers:e.correctAnswers,accuracy:e.accuracy,bestStreak:e.bestStreak,avgTimePerQuestion:e.avgTimePerQuestion,timeElapsed:e.timeElapsed,questions:[...this.questions],timestamp:new Date().toISOString()}}isHighScore(){return!this.duration||this.state===l.IDLE?!1:f.isHighScore(this.duration,this.score)}saveHighScore(e){if(!this.duration||!e)return null;const t=this.getStatistics();return t.score===0?null:f.addScore(this.duration,{name:e,score:t.score,questionsAnswered:t.questionsAnswered,accuracy:t.accuracy,avgTimePerQuestion:t.avgTimePerQuestion})}getLeaderboard(){return this.duration?f.getScores(this.duration):[]}getState(){return this.state}isActive(){return this.state===l.RUNNING||this.state===l.PAUSED}canStart(){return this.state===l.READY}exportData(){return{state:this.state,duration:this.duration,statistics:this.getStatistics(),results:this.getResults()}}}const F=new D;class G{constructor(e="https://math-royale-api.adhertz.workers.dev"){this.apiUrl=e,this.playerId=null,this.enabled=!1}async initialize(){try{let e=localStorage.getItem("math_royale_player_id");return e||(e=crypto.randomUUID(),localStorage.setItem("math_royale_player_id",e)),this.playerId=e,this.enabled=!0,console.log("Connected to global leaderboard"),!0}catch(e){console.error("Failed to connect to global leaderboard:",e),this.enabled=!1}return!1}async getLeaderboard(){if(!this.enabled)return null;try{const e=await fetch(`${this.apiUrl}/leaderboard`);if(e.ok)return(await e.json()).scores}catch(e){console.error("Failed to fetch leaderboard:",e)}return null}async submitScore(e,t,s){if(!this.enabled)return null;try{const i={displayName:e,score:t,duration:s,playerId:this.playerId},r=await fetch(`${this.apiUrl}/submit-score`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)});if(r.ok)return await r.json()}catch(i){console.error("Failed to submit score:",i)}return null}isEnabled(){return this.enabled}formatDuration(e){return{"1min":"1 Minute","2min":"2 Minutes","3min":"3 Minutes","5min":"5 Minutes"}[e]||e}}class V{constructor(e){this.ui=e||new A,this.sprintMode=F,this.isSprintActive=!1,this.selectedDuration=null,this.sharedLeaderboard=new G,this.globalLeaderboardEnabled=!1,this.currentLeaderboardView="global",this.mainLeaderboardView="global",this.completionLeaderboardView="global",this.initializeElements(),this.initializeSharedLeaderboard()}async initializeSharedLeaderboard(){const e=await this.sharedLeaderboard.initialize();this.globalLeaderboardEnabled=e,e&&(console.log("Global leaderboard enabled"),this.displayMainLeaderboard())}initializeElements(){const e=typeof document<"u"?document:globalThis.document;e&&(this.sprintBtn=e.getElementById("sprintBtn"),this.sprintSelector=e.getElementById("sprintSelector"),this.cancelSprintBtn=e.getElementById("cancelSprintBtn"),this.sprintTimerSection=e.getElementById("sprintTimerSection"),this.sprintTime=e.getElementById("sprintTime"),this.sprintScore=e.getElementById("sprintScore"),this.sprintProgressBar=e.getElementById("sprintProgressBar"),this.durationBtns=e.querySelectorAll(".sprint-duration-btn"),this.resultsModal=e.getElementById("sprintResultsModal"),this.finalScore=e.getElementById("finalScore"),this.finalQuestions=e.getElementById("finalQuestions"),this.finalAccuracy=e.getElementById("finalAccuracy"),this.finalStreak=e.getElementById("finalStreak"),this.highScoreSection=e.getElementById("highScoreSection"),this.playerNameInput=e.getElementById("playerNameInput"),this.leaderboardList=e.getElementById("leaderboardList"),this.playAgainBtn=e.getElementById("playAgainBtn"),this.closeResultsBtn=e.getElementById("closeResultsBtn"),this.clearScoresBtn=e.getElementById("clearScoresBtn"))}showSprintSelector(){this.sprintSelector&&(this.sprintSelector.style.display="block")}hideSprintSelector(){this.sprintSelector&&(this.sprintSelector.style.display="none")}startSprint(e){this.selectedDuration=e,this.isSprintActive=!0,this.sprintMode.configure(e,{onUpdate:s=>this.updateSprintDisplay(s),onFinish:s=>this.handleSprintFinish(s)}),this.sprintMode.start(),this.sprintTimerSection&&(this.sprintTimerSection.style.display="flex");const t=document.querySelector(".stats-section");return t&&(t.style.display="none"),this.updateButtonStates(),this.sprintMode.currentQuestion}updateSprintDisplay(e){if(this.sprintTime&&(this.sprintTime.textContent=this.sprintMode.getFormattedTime()),this.sprintScore&&(this.sprintScore.textContent=e.score),this.sprintProgressBar){const t=this.sprintMode.getProgress();this.sprintProgressBar.style.width=`${t}%`}}handleSprintFinish(e){this.isSprintActive=!1,this.sprintTimerSection&&(this.sprintTimerSection.style.display="none"),this.handleSprintResults(e)}async showResults(e){var i;if(!this.resultsModal)return;this.lastResults=e,this.finalScore&&(this.finalScore.textContent=e.score),this.finalQuestions&&(this.finalQuestions.textContent=e.questionsAnswered),this.finalAccuracy&&(this.finalAccuracy.textContent=`${e.accuracy}%`),this.finalStreak&&(this.finalStreak.textContent=e.bestStreak);const t=this.sprintMode.isHighScore();let s=!1;if(this.globalLeaderboardEnabled){const r=await this.sharedLeaderboard.getLeaderboard();r&&(s=r.length<100||e.score>(((i=r[99])==null?void 0:i.score)||0))}if(this.highScoreSection){const r=t||s;if(this.highScoreSection.style.display=r?"block":"none",r){const n=this.highScoreSection.querySelector(".high-score-message");n&&(n.textContent=s?"🎉 New WORLD high score!":"🎉 New high score!"),this.playerNameInput&&(this.playerNameInput.value="",this.playerNameInput.placeholder="Enter your name",this.playerNameInput.focus())}}this.lastResultQualifiesForGlobal=s,this.updateLeaderboard(),this.resultsModal.style.display="block"}hideResults(){this.resultsModal&&(this.resultsModal.style.display="none")}async updateLeaderboard(){if(!this.leaderboardList)return;let e=[];if(this.currentLeaderboardView==="global"&&this.globalLeaderboardEnabled){const s=await this.sharedLeaderboard.getLeaderboard();s&&(e=s)}else this.selectedDuration&&(e=this.sprintMode.getLeaderboard());this.leaderboardList.innerHTML="";const t=this.leaderboardList.parentElement.querySelector(".leaderboard-header");if(t&&t.remove(),this.globalLeaderboardEnabled){const s=document.createElement("div");s.className="leaderboard-header",s.style.cssText="margin-bottom: 1rem;",s.innerHTML=`
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 0.5rem;
          padding: 0.25rem;
          position: relative;
        ">
          <div style="
            position: absolute;
            left: ${this.currentLeaderboardView==="global"?"50%":"0"};
            width: 50%;
            height: calc(100% - 0.5rem);
            background: #4f46e5;
            border-radius: 0.375rem;
            transition: left 0.3s ease;
          " id="leaderboardSlider"></div>

          <button onclick="game.sprint.setLeaderboardView('local')" style="
            flex: 1;
            background: transparent;
            color: ${this.currentLeaderboardView==="local"?"white":"#6b7280"};
            border: none;
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-weight: 500;
            position: relative;
            z-index: 1;
            transition: color 0.3s ease;
          ">My Top Scores</button>

          <button onclick="game.sprint.setLeaderboardView('global')" style="
            flex: 1;
            background: transparent;
            color: ${this.currentLeaderboardView==="global"?"white":"#6b7280"};
            border: none;
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-weight: 500;
            position: relative;
            z-index: 1;
            transition: color 0.3s ease;
          ">World Top Scores</button>
        </div>
      `,this.leaderboardList.parentElement.insertBefore(s,this.leaderboardList)}if(this.clearScoresBtn&&(this.clearScoresBtn.style.display=this.currentLeaderboardView==="global"?"none":"block"),e.length===0){this.leaderboardList.innerHTML="<li>No scores yet!</li>";return}e.forEach((s,i)=>{const r=document.createElement("li"),n=s.displayName||s.name;r.innerHTML=`
        <span>${i+1}. ${n}</span>
        <span>${s.score} pts</span>
      `,this.leaderboardList.appendChild(r)})}toggleLeaderboardView(){this.currentLeaderboardView=this.currentLeaderboardView==="local"?"global":"local",this.updateLeaderboard()}setLeaderboardView(e){this.currentLeaderboardView=e,this.updateLeaderboard()}async saveHighScore(){if(!this.playerNameInput||!this.playerNameInput.value.trim())return!1;const e=this.playerNameInput.value.trim(),t=this.sprintMode.saveHighScore(e);let s=null;if(this.globalLeaderboardEnabled&&this.lastResults&&this.lastResultQualifiesForGlobal){const i=await this.sharedLeaderboard.submitScore(e,this.lastResults.score,this.selectedDuration);i&&i.success&&(s=i.rank,this.currentLeaderboardView="global")}return this.updateLeaderboard(),this.highScoreSection&&(this.highScoreSection.style.display="none"),s?(this.ui.showFeedback(!0,null),this.ui.feedback.textContent=`🌍 World Rank #${s}!`):t===1?(this.ui.showFeedback(!0,null),this.ui.feedback.textContent="🏆 New #1 High Score!"):t&&(this.ui.showFeedback(!0,null),this.ui.feedback.textContent=`🎉 Ranked #${t} on the leaderboard!`),t||s}stopSprint(){this.isSprintActive&&(this.sprintMode.stop(),this.isSprintActive=!1,this.sprintTimerSection&&(this.sprintTimerSection.style.display="none"),this.updateButtonStates(),this.sprintMode.reset())}resetSprint(){this.sprintMode.reset(),this.isSprintActive=!1,this.selectedDuration=null,this.hideSprintSelector(),this.sprintTimerSection&&(this.sprintTimerSection.style.display="none"),this.sprintProgressBar&&(this.sprintProgressBar.style.width="0%")}updateButtonStates(){this.sprintBtn&&(this.sprintBtn.disabled=this.isSprintActive)}isActive(){return this.isSprintActive}getCurrentQuestion(){return this.sprintMode.currentQuestion}submitAnswer(e){return this.sprintMode.submitAnswer(e)}nextQuestion(){return this.sprintMode.nextQuestion()}clearCurrentDurationScores(){this.selectedDuration&&(f.clearScores(this.selectedDuration),this.updateLeaderboard(),this.ui&&this.ui.feedback&&(this.ui.showFeedback(!0,null),this.ui.feedback.textContent="High scores cleared!"))}async displayMainLeaderboard(){const e=document.getElementById("mainLeaderboardContent");if(!e)return;this.selectedDuration="1min";let t=[];if(this.mainLeaderboardView==="global"&&this.globalLeaderboardEnabled){const i=await this.sharedLeaderboard.getLeaderboard();i&&(t=i)}else t=this.sprintMode.getLeaderboard("1min");let s=`
      <div style="
        background: white;
        border-radius: 0.75rem;
        padding: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      ">
    `;this.globalLeaderboardEnabled&&(s+=`
        <div style="margin-bottom: 0.75rem;">
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            border-radius: 0.5rem;
            padding: 0.25rem;
            position: relative;
          ">
            <div style="
              position: absolute;
              left: ${this.mainLeaderboardView==="global"?"50%":"0"};
              width: 50%;
              height: calc(100% - 0.5rem);
              background: #4f46e5;
              border-radius: 0.375rem;
              transition: left 0.3s ease;
            " id="mainLeaderboardSlider"></div>

            <button onclick="game.sprint.setMainLeaderboardView('local')" style="
              flex: 1;
              background: transparent;
              color: ${this.mainLeaderboardView==="local"?"white":"#6b7280"};
              border: none;
              padding: 0.5rem 1rem;
              cursor: pointer;
              font-weight: 500;
              position: relative;
              z-index: 1;
              transition: color 0.3s ease;
            ">My Top Scores</button>

            <button onclick="game.sprint.setMainLeaderboardView('global')" style="
              flex: 1;
              background: transparent;
              color: ${this.mainLeaderboardView==="global"?"white":"#6b7280"};
              border: none;
              padding: 0.5rem 1rem;
              cursor: pointer;
              font-weight: 500;
              position: relative;
              z-index: 1;
              transition: color 0.3s ease;
            ">World Top Scores</button>
          </div>
        </div>
      `),s+=`
      <div style="
        min-height: 250px;
        max-height: min(50vh, 400px);
        overflow-y: auto;
        overflow-x: hidden;
        border-top: 1px solid #e5e7eb;
      ">
        <ol style="list-style: none; padding: 0; margin: 0;">
    `,t.length===0?s+='<li style="text-align: center; color: #6b7280; padding: 0.5rem;">No scores yet!</li>':t.forEach((i,r)=>{const n=i.displayName||i.name;s+=`
          <li style="
            display: flex;
            justify-content: space-between;
            padding: 0.25rem 0.375rem;
            border-bottom: 1px solid #e5e7eb;
            font-size: 0.875rem;
            ${r===0?"font-weight: bold; color: #fbbf24;":""}
            ${r===1?"color: #9ca3af;":""}
            ${r===2?"color: #a87c4c;":""}
          ">
            <span>${r===0?"🥇 ":r===1?"🥈 ":r===2?"🥉 ":""}${r+1}. ${n}</span>
            <span>${i.score} pts</span>
          </li>
        `}),s+="</ol></div></div>",e.innerHTML=s}setMainLeaderboardView(e){this.mainLeaderboardView=e,this.displayMainLeaderboard()}async handleSprintResults(e){var i;this.lastResults=e;const t=this.sprintMode.isHighScore();let s=!1;if(this.globalLeaderboardEnabled&&e.score>0){const r=await this.sharedLeaderboard.getLeaderboard();r&&(s=r.length<100||e.score>(((i=r[99])==null?void 0:i.score)||0))}t||s?this.showHighScoreModal(e,s):this.showQuickResults(e)}showHighScoreModal(e,t){const s=document.querySelector(".modal");s&&s.remove();const i=document.createElement("div");i.className="modal",i.id="highScoreModal",i.style.display="block",i.innerHTML=`
      <div class="modal-content" style="max-width: 400px;">
        <h2>${t?"🎉 New WORLD high score!":"🎉 New high score!"}</h2>
        <div style="text-align: center; margin: 1rem 0;">
          <div style="font-size: 2rem; font-weight: bold; color: #4f46e5;">${e.score} pts</div>
          <div style="color: #6b7280; margin-top: 0.5rem;">
            ${e.questionsAnswered} questions • ${e.accuracy}% accuracy
          </div>
        </div>
        <input
          type="text"
          id="highScoreNameInput"
          placeholder="Enter your name"
          maxlength="20"
          style="
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 1rem;
            margin: 1rem 0;
          "
          autofocus
        >
        <div style="display: flex; gap: 0.5rem;">
          <button id="saveHighScoreBtn" class="btn btn-primary" style="flex: 1;">Save Score</button>
          <button id="skipHighScoreBtn" class="btn btn-secondary" style="flex: 1;">Skip</button>
        </div>
      </div>
    `,document.body.appendChild(i),this.lastResultQualifiesForGlobal=t;const r=i.querySelector("#highScoreNameInput"),n=i.querySelector("#saveHighScoreBtn"),a=i.querySelector("#skipHighScoreBtn"),d=async()=>{const c=r.value.trim();if(c){const u=this.sprintMode.saveHighScore(c);console.log("Local save result:",u);let h=null;if(this.globalLeaderboardEnabled&&t){const p=await this.sharedLeaderboard.submitScore(c,e.score,this.selectedDuration);console.log("Global save result:",p),p&&p.success&&(h=p.rank)}const y=h?`🌍 World Rank #${h}!`:u?`🎉 Ranked #${u}!`:"Score saved!";i.remove(),e.successMessage=y,setTimeout(()=>{this.showCompletionScreen(e)},50)}else i.remove(),setTimeout(()=>{this.showCompletionScreen(e)},50)};n.addEventListener("click",d),r.addEventListener("keydown",c=>{c.key==="Enter"&&d()}),a.addEventListener("click",()=>{i.remove(),setTimeout(()=>{this.showCompletionScreen(e)},50)})}cleanupCompletionScreen(){const e=document.getElementById("sprintCompletionScreen");e&&e.remove()}restartSprintFromCompletion(){this.cleanupCompletionScreen(),this.sprintMode.reset(),this.ui.setGameActive(!0,"sprint");const e=this.startSprint("1min");e&&this.ui.displayQuestion(e)}startPracticeFromCompletion(){this.cleanupCompletionScreen(),this.resetSprint(),this.returnToMain(),setTimeout(()=>{window.game&&window.game.startPracticeMode()},100)}showCompletionScreen(e){const t=document.getElementById("sprintCompletionScreen");t&&t.remove(),document.querySelectorAll(".modal").forEach(c=>{c.style.display="none",c.remove()}),this.resultsModal&&(this.resultsModal.style.display="none"),this.sprintTimerSection&&(this.sprintTimerSection.style.display="none"),document.querySelectorAll(".question-section, .answer-section, .controls-section, .sprint-timer-section").forEach(c=>{c&&(c.style.display="none")}),this.ui.modeSelector&&(this.ui.modeSelector.style.display="none");const r=document.createElement("div");r.id="sprintCompletionScreen",r.className="completion-screen",r.innerHTML=`
      <div class="header" style="text-align: center; margin-bottom: 1.5rem;">
        <h2 style="color: #4f46e5; margin-bottom: 1rem;">Sprint Complete!</h2>

        <!-- Results display -->
        <div style="
          background: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        ">
          <div style="font-size: 2.5rem; font-weight: bold; color: #4f46e5; margin-bottom: 0.5rem;">
            ${e.score} pts
          </div>
          <div style="display: flex; justify-content: center; gap: 2rem; color: #6b7280;">
            <span>${e.questionsAnswered} questions</span>
            <span>${e.accuracy}% accuracy</span>
            <span>${e.bestStreak} streak</span>
          </div>
          ${e.successMessage?`
            <div style="margin-top: 1rem; padding: 0.75rem; background: linear-gradient(135deg, #f59e0b, #10b981); color: white; border-radius: 0.5rem; font-weight: 500;">
              ${e.successMessage}
            </div>
          `:""}
        </div>

        <!-- Leaderboard container -->
        <div id="completionLeaderboard" style="margin-bottom: 1.5rem;">
          <!-- Leaderboard will be inserted here -->
        </div>

        <!-- Action buttons -->
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button id="tryAgainBtn" class="btn btn-sprint" style="padding: 1rem 2rem; font-size: 1.1rem;">
            Try Again
          </button>
          <button id="practiceBtn" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">
            Practice Mode
          </button>
        </div>
      </div>
    `,document.querySelector(".game-area").appendChild(r),this.displayCompletionLeaderboard();const a=document.getElementById("tryAgainBtn"),d=document.getElementById("practiceBtn");a.addEventListener("click",()=>{this.restartSprintFromCompletion()}),d.addEventListener("click",()=>{this.startPracticeFromCompletion()})}async displayCompletionLeaderboard(){const e=document.getElementById("completionLeaderboard");if(!e)return;let t=[];if(this.completionLeaderboardView==="global"&&this.globalLeaderboardEnabled){const i=await this.sharedLeaderboard.getLeaderboard();i&&(t=i)}else t=this.sprintMode.getLeaderboard("1min");let s=`
      <div style="
        background: white;
        border-radius: 0.75rem;
        padding: 0.75rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      ">
    `;this.globalLeaderboardEnabled&&(s+=`
        <div style="margin-bottom: 0.75rem;">
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f3f4f6;
            border-radius: 0.5rem;
            padding: 0.25rem;
            position: relative;
          ">
            <div style="
              position: absolute;
              left: ${this.completionLeaderboardView==="global"?"50%":"0"};
              width: 50%;
              height: calc(100% - 0.5rem);
              background: #4f46e5;
              border-radius: 0.375rem;
              transition: left 0.3s ease;
            " id="completionLeaderboardSlider"></div>

            <button onclick="game.sprint.setCompletionLeaderboardView('local')" style="
              flex: 1;
              background: transparent;
              color: ${this.completionLeaderboardView==="local"?"white":"#6b7280"};
              border: none;
              padding: 0.5rem 1rem;
              cursor: pointer;
              font-weight: 500;
              position: relative;
              z-index: 1;
              transition: color 0.3s ease;
            ">My Top Scores</button>

            <button onclick="game.sprint.setCompletionLeaderboardView('global')" style="
              flex: 1;
              background: transparent;
              color: ${this.completionLeaderboardView==="global"?"white":"#6b7280"};
              border: none;
              padding: 0.5rem 1rem;
              cursor: pointer;
              font-weight: 500;
              position: relative;
              z-index: 1;
              transition: color 0.3s ease;
            ">World Top Scores</button>
          </div>
        </div>
      `),s+=`
      <div style="
        min-height: 200px;
        max-height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
        border-top: 1px solid #e5e7eb;
      ">
        <ol style="list-style: none; padding: 0; margin: 0;">
    `,t.length===0?s+='<li style="padding: 1rem; text-align: center; color: #6b7280;">No scores yet!</li>':t.forEach((i,r)=>{const n=i.displayName||i.name;s+=`
          <li style="
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
            ${r===0?"background: linear-gradient(135deg, #f59e0b, #10b981); color: white; font-weight: bold;":""}
          ">
            <span>${r+1}. ${n}</span>
            <span>${i.score} pts</span>
          </li>
        `}),s+="</ol></div></div>",e.innerHTML=s}setCompletionLeaderboardView(e){this.completionLeaderboardView=e,this.displayCompletionLeaderboard()}showQuickResults(e){this.showCompletionScreen(e)}returnToMain(){this.resetSprint(),this.ui.reset(),this.ui.showModeSelector(),this.globalLeaderboardEnabled&&this.displayMainLeaderboard()}}class H{constructor(){this.ui=new A,this.session=R,this.sprint=new V(this.ui),this.currentQuestion=null,this.isWaitingForNext=!1,this.mode="practice",this.initializeEventListeners()}initializeEventListeners(){this.ui.on(this.ui.startPracticeBtn,"click",()=>this.startPracticeMode()),this.ui.on(this.ui.startSprintBtn,"click",()=>this.startSprintMode("1min")),this.ui.on(this.ui.resetBtn,"click",()=>this.handleReset()),this.ui.on(this.ui.answerInput,"keydown",e=>{e.key==="Enter"&&(e.preventDefault(),this.handleAnswerSubmit())}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.handleReset(),e.key===" "&&!this.ui.isAnswerFocused()&&(e.preventDefault(),this.handleStartNext()),e.key==="?"&&!this.ui.isAnswerFocused()&&this.ui.showKeyboardShortcuts()}),this.initializeSprintListeners()}initializeSprintListeners(){const e=document.getElementById("cancelSprintBtn");e&&e.addEventListener("click",()=>this.hideSprintSelector()),document.querySelectorAll(".sprint-duration-btn").forEach(r=>{r.addEventListener("click",n=>{const a=n.target.dataset.duration;this.startSprintMode(a)})});const s=document.getElementById("playerNameInput");s&&s.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),this.sprint.saveHighScore())});const i=document.getElementById("clearScoresBtn");i&&i.addEventListener("click",()=>{confirm("Are you sure you want to clear all high scores for this duration?")&&this.sprint.clearCurrentDurationScores()})}showSprintSelector(){this.session.isSessionActive()&&this.session.pause(),this.sprint.showSprintSelector()}hideSprintSelector(){this.sprint.hideSprintSelector(),this.session.isPaused()&&this.session.resume()}startSprintMode(e){this.session.isSessionActive()&&this.session.end(),this.sprint.hideSprintSelector(),this.mode="sprint",this.isWaitingForNext=!1;const t=this.sprint.startSprint(e);this.currentQuestion=t,this.ui.displayQuestion(t),this.ui.setGameActive(!0,"sprint")}startPracticeMode(){this.mode="practice",this.startGame()}handleStartNext(){this.session.isSessionActive()?this.nextQuestion():this.startGame()}startGame(){this.session.start(),this.ui.setGameActive(!0,this.mode),this.isWaitingForNext=!1,this.mode==="practice"&&this.ui.showStatsSection(),this.nextQuestion()}nextQuestion(){this.ui.clearAnswer(),this.currentQuestion=T(),this.session.startQuestion(this.currentQuestion),this.ui.displayQuestion(this.currentQuestion),this.updateStats(),this.isWaitingForNext=!1}handleAnswerSubmit(){if(!this.currentQuestion||this.isWaitingForNext)return;const e=this.ui.getAnswer();if(!e)return;let t;if(this.mode==="sprint"){if(t=this.sprint.submitAnswer(e),!t)return;this.ui.showFeedback(t.isCorrect,t.correctAnswer),setTimeout(()=>{if(this.sprint.isActive()){const s=this.sprint.nextQuestion();s&&(this.currentQuestion=s,this.ui.displayQuestion(s))}},100)}else t=this.session.submitAnswer(e),this.ui.showFeedback(t.isCorrect,t.correctAnswer),this.updateStats(),this.isWaitingForNext=!0,setTimeout(()=>{this.session.isSessionActive()&&this.nextQuestion()},100)}handleReset(){if(this.mode==="sprint"){if(this.sprint.isSprintActive){const t=this.sprint.sprintMode.getResults();if(this.sprint.stopSprint(),t&&t.questionsAnswered>0){this.sprint.handleSprintResults(t);return}}this.mode="practice",this.resetGame();return}const e=this.session.end();e.totalQuestions>0?(this.ui.showSessionSummary(e),setTimeout(()=>{this.resetGame()},2e3)):this.resetGame()}resetGame(){this.session.reset(),this.ui.reset(),this.currentQuestion=null,this.isWaitingForNext=!1,this.ui.showModeSelector()}updateStats(){const e=this.session.getStatistics();this.ui.updateStatistics(e)}checkPerformance(){const e=this.session.getPerformanceTrend();e&&(e.trend==="improving"&&e.recentAccuracy>90?(this.ui.showFeedback(!0,null),this.ui.feedback.textContent="🚀 Great progress! You're on fire!"):e.trend==="declining"&&e.recentAccuracy<50&&(this.ui.feedback.textContent="💡 Take your time, focus on accuracy",this.ui.feedback.className="feedback"))}saveProgress(){const e=this.session.exportData();localStorage.setItem("mathFluencyProgress",JSON.stringify(e))}loadProgress(){const e=localStorage.getItem("mathFluencyProgress");if(e)try{const t=JSON.parse(e);return this.session.importData(t),this.session.isSessionActive()&&this.session.end(),this.ui.showModeSelector(),this.ui.hideGameSections(),!0}catch(t){console.error("Failed to load progress:",t)}return!1}}function E(){const o=document.querySelector('script[type="module"]:not([src])');o&&o.remove();const e=new H;window.game=e,window.clearAllScores=async()=>{if(confirm("This will clear ALL high scores across all durations. Are you sure?")){const{highScores:t}=await B(async()=>{const{highScores:s}=await Promise.resolve().then(()=>$);return{highScores:s}},void 0);return t.clearScores(),console.log("All high scores cleared!"),"All scores cleared"}return"Cancelled"},console.log("Developer commands available:"),console.log("- clearAllScores() : Clear all high scores"),console.log("- game : Access game instance"),e.loadProgress()&&console.log("Previous session restored"),setInterval(()=>{e.session.isSessionActive()&&e.saveProgress()},3e4),window.addEventListener("beforeunload",()=>{e.session.isSessionActive()&&e.saveProgress()}),console.log("Math Royale initialized! Press Start to begin.")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E();
//# sourceMappingURL=index-CRnCMlzm.js.map
