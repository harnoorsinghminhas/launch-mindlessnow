/* "Today": picks one timeless entry by day of year, so the page is fresh every day with no updates.
   Entries rotate through a fixed list; textContent only (no innerHTML), so the page runs under require-trusted-types-for 'script'. */
(function () {
"use strict";
var ENTRIES = [["After a long chat", "Close your eyes for three breaths before the next prompt. Let the last answer settle."], ["Before you press enter", "Ask once: do I need to ask this? Breathe, then decide."], ["Look far away", "Rest your eyes on something far from the screen for twenty seconds."], ["Roll the shoulders", "Stand up and roll your shoulders back three times. Sit down slower than you stood."], ["Hands on the desk", "Put both hands flat on the desk. Feel the surface. Come back to the room."], ["Between two tasks", "Breathe out slowly twice before you open the next window."], ["Soften the tongue and jaw", "Notice your tongue and jaw. Let both go soft. Then carry on."], ["Listen to the room", "Lower the screen a little and listen for the quietest sound you can find."], ["One slow sip", "Take one sip of water, slowly. Nothing else for the length of the sip."], ["Read it aloud", "Read your last prompt out loud, quietly. Does it sound like you?"], ["Feel your feet", "Notice where your weight sits. Let the chair and the floor hold it."], ["Sixty seconds of nothing", "Write nothing for one minute. Let the blank page be fine."], ["Before the meeting", "Take one breath for each person who is about to join. Then say hello."], ["Answers arrive fast", "When an answer arrives faster than you can think, count to five before you accept it."], ["Name a colour", "Look at the sky or the ceiling and name the colour you see. Then go back."], ["Closing the day", "Close your tabs one at a time, breathing out with each one."]];
var t = document.getElementById("today-t"), b = document.getElementById("today-b"), n = document.getElementById("today-n"), d = document.getElementById("today-date");
if (!t || !b || !ENTRIES.length) return;
var now = new Date();
var doy = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86400000);
var i = doy % ENTRIES.length;
t.textContent = ENTRIES[i][0];
b.textContent = ENTRIES[i][1];
if (n) n.textContent = "Entry " + (i + 1) + " of " + ENTRIES.length + ". A new one every day.";
if (d) { try { d.textContent = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }); } catch (e) { /* keep the default label */ } }
})();
