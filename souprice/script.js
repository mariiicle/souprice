(function(){

  // ---------- SOUND (tiny synthesized beeps, no external files) ----------
  let soundOn = true;
  let audioCtx = null;
  function getCtx(){
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }
  function beep(freq, dur, type){
    if(!soundOn) return;
    try{
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    }catch(e){ /* audio not available, fail silently */ }
  }
  const sfx = {
    start: () => { beep(523,0.09); setTimeout(()=>beep(784,0.12),90); },
    open: () => beep(660,0.07),
    close: () => beep(330,0.07),
    win: () => { beep(659,0.08); setTimeout(()=>beep(880,0.08),80); setTimeout(()=>beep(1046,0.16),160); }
  };

  const soundBtn = document.getElementById('sound-toggle');
  soundBtn.addEventListener('click', function(){
    soundOn = !soundOn;
    soundBtn.textContent = soundOn ? '🔊 SFX' : '🔈 MUTED';
    soundBtn.setAttribute('aria-pressed', soundOn);
  });

  // ---------- BACKGROUND MUSIC (real audio file) ----------
  let musicOn = true;
  let musicStarted = false;
  const MUSIC_VOLUME = 0.45;
  const bgMusic = new Audio('bgm.m4a');
  bgMusic.loop = true;
  bgMusic.preload = 'auto';
  bgMusic.volume = musicOn ? MUSIC_VOLUME : 0;

  function startMusic(){
    if(musicStarted) return;
    const playPromise = bgMusic.play();
    if(playPromise && typeof playPromise.then === 'function'){
      playPromise.then(function(){
        musicStarted = true;
      }).catch(function(){
        // Browser blocked autoplay (no user gesture yet) — leave musicStarted
        // false so the next interaction (Start button / first tap) retries.
      });
    } else {
      musicStarted = true;
    }
  }

  const musicBtn = document.getElementById('music-toggle');
  musicBtn.addEventListener('click', function(){
    musicOn = !musicOn;
    musicBtn.textContent = musicOn ? '🎵 MUSIC' : '🎵 MUTED';
    musicBtn.setAttribute('aria-pressed', musicOn);
    bgMusic.volume = musicOn ? MUSIC_VOLUME : 0;
  });

  // ---------- DATA ----------
  const levels = [
    {
      type:'adventure', num:'LV.01', icon:'☕', label:'Tropa Time',
      title:'Tropa Time', img:'images/lv1.jpeg',
      body:'The very first coffee "date" that started as just tropa time. We both know how that turned out.'
    },
    {
      type:'adventure', num:'LV.02', icon:'🎭', label:'Con Debut',
      title:'First Cosplay Convention', img:'images/lv2.jpeg',
      body:"Way back in 2024, our first convention together. First of many, hopefully."
    },
    {
      type:'adventure', num:'LV.03', icon:'🌳', label:'Promenade Chill',
      title:"Chillin' at Promenade", img:'images/lv3.jpeg',
      body:'After class, no plans, no agenda. Just sitting at the promenade together doing absolutely nothing important, and it was still one of the best parts of the week.'
    },
    {
      type:'adventure', num:'LV.04', icon:'⛪', label:'Sunday Service',
      title:'Church Together', img:'images/lv4.jpeg',
      body:"Went to church together. Ngl it's been a while since our last one (broke era 😭) but it still counts as one of our adventures! And a reminder we should go again soon."
    },
    {
      type:'adventure', num:'LV.05', icon:'🛍️', label:'Vermosa Trip',
      title:'Vermosa Window Shopping', img:'images/lv5.jpg',
      body:"Went out to Vermosa to chill and window shop. Didn't need to buy anything HAHAHAH LOLOLOL just needed to be there with you."
    },
    {
      type:'adventure', num:'LV.06', icon:'🏛️', label:'Museum Day',
      title:'National Museum', img:'images/lv6.jpg',
      body:'A quiet, slow-walk kind of day exploring the National Museum together.'
    },
    {
      type:'adventure', num:'LV.07', icon:'🐉', label:'Binondo Run',
      title:'Binondo, Manila', img:'images/lv7.jpeg',
      body:"Wandered around the oldest Chinatown in the world. Loud streets, good food, better company."
    },
    {
      type:'adventure', num:'LV.08', icon:'💐', label:"Valentine's Special",
      title:"Valentine's Day Together", img:'images/lv8.jpg',
      body:"We visited Festival Mall together, and the rest is history."
    },
    {
      type:'adventure', num:'LV.09', icon:'📸', label:'Tagaytay Walk',
      title:'Tagaytay Photowalk', img:'images/lv9.jpg',
      body:'A photowalk / walktrip in Tagaytay that ended at Picnic Grove. Cool air, good views, camera roll full of us.'
    },
    {
      type:'bonus', num:'BONUS A', icon:'🎬', label:'Movie Marathon',
      title:'Things We Watched',
      body:'movies'
    },
    {
      type:'bonus', num:'BONUS B', icon:'🎵', label:'The Jukebox',
      title:"Songs That Remind Me of You",
      body:'music'
    },
    {
      type:'final', num:'LV.∞', icon:'💛', label:'To Be Continued',
      title:'Level ∞ — To Be Continued',
      body:'final'
    }
  ];

  const movies = [
    {title:'Frieren', img:'images/frieren.jpg', note:"You always end up whistling the theme song, especially when we're on adventures."},
    {title:'Jujutsu Kaisen', img:'images/jujutsu.jpg', note:'It makes me feel so excited on our virtual movie marathon dates.'},
    {title:'Pyramid Game', img:'images/pyramid.jpg', note:"Same as JJK, we even had small arguments over it, but we managed to finish it lol."},
    {title:'The Wild Robot', img:'images/robot.jpg', note:"Cozy for me, but it makes you cry, because you're such an empathetic person."},
    {title:'Obsession (silly pick lol)', img:'images/obsession.jpg', note:"Made me jump straight off the bed watching it with you. NGL, me and Freaky Nikki have a lot in common lol."},
    {title:'Game of Thrones', img:'images/thrones.jpg', note:"Our recent series we watch every night as our way of resting together as LDR lololol"},
    {title:"a few more... memory's fuzzy", mystery:true}
  ];

  // Real, licensed embeds — Spotify's official player and Bandcamp's official player.
  // No audio files are hosted here; these iframes stream directly from the source platform.
  const tracks = [
    {
      title:'Enchanted', artist:'Taylor Swift',
      note:"Played during our Spotify Jam, completely at random. My delulu meter hit max! I was so sure you picked it on purpose!",
      embed:'<iframe src="https://open.spotify.com/embed/track/10eBRyImhfqVvkiVEGf0N0?utm_source=generator" width="100%" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'
    },
    {
      title:'Mr. Sun', artist:'Over October',
      note:"As long as I'm with you, the world doesn't feel as overwhelming. This song just calms my mind whenever I think of you.",
      embed:'<iframe src="https://open.spotify.com/embed/track/5IlUtxVIGi0d2g3Ewcid2M?utm_source=generator" width="100%" height="80" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'
    },
    {
      title:'Meaningful Silence (Our Song)', artist:'The Ridleys',
      note:"Plays in my head every time we're just chilling in silence, or on one of our coexisting calls. It's from the playlist you sent me as a Christmas gift.",
      embed:'<iframe src="https://bandcamp.com/EmbeddedPlayer/track=887063785/size=large/tracklist=false/artwork=small/transparent=true/" seamless width="100%" height="120"></iframe>'
    }
  ];

  // ---------- AMBIENT SMOKE ----------
  // a few soft, slow-rising smoke wisps drifting up from the bottom of the screen
  (function addSmoke(){
    const smokeDecor = document.createElement('div');
    smokeDecor.id = 'smoke-decor';
    document.body.appendChild(smokeDecor);
    const count = 6;
    for(let i=0; i<count; i++){
      const puff = document.createElement('div');
      puff.className = 'smoke';
      const size = 120 + Math.random()*160;
      puff.style.width = size + 'px';
      puff.style.height = size + 'px';
      puff.style.left = (Math.random()*100) + '%';
      puff.style.animationDuration = (22 + Math.random()*18) + 's';
      puff.style.animationDelay = (-Math.random()*30) + 's';
      smokeDecor.appendChild(puff);
    }
  })();

  // ---------- BUILD MAP ----------
  const pathWrap = document.getElementById('path-wrap');
  const positions = ['left','right','left','right','left','right','left','right','left','center','center','center'];

  // decorative twinkling stars scattered behind the path
  const starsDecor = document.createElement('div');
  starsDecor.id = 'stars-decor';
  for(let s=0; s<18; s++){
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = '✦';
    star.style.left = Math.random()*94 + '%';
    star.style.top = Math.random()*94 + '%';
    star.style.animationDelay = (Math.random()*2.6) + 's';
    starsDecor.appendChild(star);
  }
  pathWrap.appendChild(starsDecor);

  levels.forEach(function(lv, i){
    const row = document.createElement('div');
    row.className = 'node-row ' + positions[i];

    const slot = document.createElement('div');
    slot.className = 'node-slot';

    const node = document.createElement('button');
    node.className = 'node' + (lv.type === 'bonus' ? ' bonus' : lv.type === 'final' ? ' final' : '');
    node.innerHTML =
      '<span class="num pixel-font">' + lv.num + '</span>' +
      '<span class="icon">' + lv.icon + '</span>' +
      '<span class="label">' + lv.label + '</span>';

    node.addEventListener('click', function(){ openLevel(lv); });
    slot.appendChild(node);
    row.appendChild(slot);
    pathWrap.appendChild(row);
  });

  // ---------- TITLE -> MAP ----------
  document.getElementById('start-btn').addEventListener('click', function(){
    sfx.start();
    startMusic();
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('map-screen').classList.remove('hidden');
  });

  // Browsers block audio until the user interacts with the page at least once.
  // Rather than wait for the Press Start click, kick music off on the very
  // first tap/click/keypress anywhere, so it's already playing by the time
  // they reach the title screen's Start button.
  ['pointerdown','keydown'].forEach(function(evt){
    window.addEventListener(evt, startMusic, { once:true, passive:true });
  });

  // ---------- MODAL ----------
  const overlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');

  function photoPlaceholder(label){
    return '<div class="img-placeholder"><span class="ph-icon">🖼️</span><span class="ph-text">' + label + '</span></div>';
  }

  // renders a real photo if the level has one, falls back to the placeholder frame otherwise
  function photoBlock(lv){
    if(lv.img){
      return '<div class="img-frame"><img class="level-photo" src="' + lv.img + '" alt="' + lv.title + '"></div>';
    }
    return photoPlaceholder('INSERT PHOTO');
  }

  function openLevel(lv){
    sfx.open();
    let inner = '';

    if(lv.body === 'movies'){
      inner += '<span class="stamp pixel-font">QUEST LOG</span>';
      inner += '<h2 class="pixel-font">' + lv.title + '</h2>';
      inner += '<div class="carousel">';
      inner += '<button class="car-btn" id="movie-prev" aria-label="Previous">◀</button>';
      inner += '<div class="cart-single" id="movie-display"></div>';
      inner += '<button class="car-btn" id="movie-next" aria-label="Next">▶</button>';
      inner += '</div>';
      inner += '<div class="car-counter" id="movie-counter"></div>';
    } else if(lv.body === 'music'){
      inner += '<span class="stamp pixel-font">QUEST LOG</span>';
      inner += '<h2 class="pixel-font">' + lv.title + '</h2>';
      inner += '<div class="carousel">';
      inner += '<button class="car-btn" id="track-prev" aria-label="Previous song">◀</button>';
      inner += '<div class="cart-single track-single" id="track-display"></div>';
      inner += '<button class="car-btn" id="track-next" aria-label="Next song">▶</button>';
      inner += '</div>';
      inner += '<div class="car-counter" id="track-counter"></div>';
    } else if(lv.body === 'final'){
      sfx.win();
      inner += '<span class="stamp pixel-font">GAME COMPLETE</span>';
      inner += '<h2 class="pixel-font">' + lv.title + '</h2>';
      inner += photoPlaceholder('OUR NEXT PHOTO');
      inner += '<p class="final-msg">Two years down. Every level on this map actually happened — and I wouldn\'t want to have played any of it with anyone else.<br><br>Here\'s to the levels we haven\'t unlocked yet.<br><br>Happy 2nd anniversary, Habi. I love you.</p>';
      inner += '<div class="final-sign">— Wabi 💛</div>';
      launchConfetti();
    } else {
      inner += '<span class="stamp pixel-font">QUEST COMPLETE</span>';
      inner += '<h2 class="pixel-font">' + lv.title + '</h2>';
      inner += photoBlock(lv);
      inner += '<p class="body-text">' + lv.body + '</p>';
    }

    modalContent.innerHTML = inner;
    overlay.classList.remove('hidden');

    if(lv.body === 'movies'){
      let idx = 0;
      const display = document.getElementById('movie-display');
      const counter = document.getElementById('movie-counter');
      const prevBtn = document.getElementById('movie-prev');
      const nextBtn = document.getElementById('movie-next');

      function renderMovie(){
        const m = movies[idx];
        display.className = 'cart-single' + (m.mystery ? ' mystery' : '');
        const visual = m.img
          ? '<img class="cart-photo" src="' + m.img + '" alt="' + m.title + '">'
          : '<div class="cart-icon">' + (m.icon || '🎞️') + '</div>';
        display.innerHTML = visual + '<div class="cart-title">' + m.title + '</div>' +
          (m.note ? '<div class="cart-note">' + m.note + '</div>' : '');
        counter.textContent = (idx + 1) + ' / ' + movies.length;
      }
      prevBtn.addEventListener('click', function(){
        beep(392,0.05);
        idx = (idx - 1 + movies.length) % movies.length;
        renderMovie();
      });
      nextBtn.addEventListener('click', function(){
        beep(523,0.05);
        idx = (idx + 1) % movies.length;
        renderMovie();
      });
      renderMovie();
    }

    if(lv.body === 'music'){
      let tIdx = 0;
      const tDisplay = document.getElementById('track-display');
      const tCounter = document.getElementById('track-counter');
      const tPrevBtn = document.getElementById('track-prev');
      const tNextBtn = document.getElementById('track-next');

      function renderTrack(){
        const t = tracks[tIdx];
        tDisplay.innerHTML =
          '<div class="track-head"><span class="vinyl">💿</span><div class="track-info">' +
          '<div class="t-title">' + t.title + '</div>' +
          '<div class="t-artist">' + t.artist + '</div>' +
          '</div></div>' +
          '<div class="t-note">' + t.note + '</div>' +
          '<div class="track-audio">' + t.embed + '</div>';
        tCounter.textContent = (tIdx + 1) + ' / ' + tracks.length;
      }
      tPrevBtn.addEventListener('click', function(){
        beep(392,0.05);
        tIdx = (tIdx - 1 + tracks.length) % tracks.length;
        renderTrack();
      });
      tNextBtn.addEventListener('click', function(){
        beep(523,0.05);
        tIdx = (tIdx + 1) % tracks.length;
        renderTrack();
      });
      renderTrack();
    }
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
  });

  function closeModal(){
    sfx.close();
    overlay.classList.add('hidden');
  }

  // ---------- CONFETTI HEARTS ----------
  function launchConfetti(){
    const emojis = ['🌹','✨','🕊️','💛'];
    for(let i=0; i<26; i++){
      setTimeout(function(){
        const el = document.createElement('div');
        el.className = 'confetti-heart';
        el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        el.style.left = Math.random()*100 + 'vw';
        el.style.animationDuration = (2.2 + Math.random()*1.8) + 's';
        el.style.fontSize = (14 + Math.random()*14) + 'px';
        document.body.appendChild(el);
        setTimeout(function(){ el.remove(); }, 4200);
      }, i*60);
    }
  }

})();
