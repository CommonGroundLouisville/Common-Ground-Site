import json,sys
D=sys.argv[1]
P=json.load(open(D+'/parts.json'))
FONTS='<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Work+Sans:wght@400;500;600&display=swap">\n<link rel="stylesheet" href="site.css">'
TOUR='https://calendar.app.google.com/GQ8R7xq9K1n8rcDF7'
def nav(cur):
    items=[('cowork.html','Cowork'),('memberships.html','Memberships'),('podcast.html','Podcast'),('community.html','Community')]
    li=''.join('<li><a href="%s"%s>%s</a></li>'%(h,' aria-current="page"' if h==cur else '',t) for h,t in items)
    return f'''<div class="mock">Design sample · Common Ground · not live</div>
<div class="wrap">
  <nav class="nav" aria-label="Main">
    <a class="brand" href="index.html"><img src="cg-logo-2024.png" alt="Common Ground home"></a>
    <ul class="links">{li}</ul>
    <a class="btn primary" href="{TOUR}">Book a tour <span class="ar">→</span></a>
  </nav>
'''
FOOT='''<footer>
  <div class="wrap">
    <span>© Common Ground, est. 2024 · 12100 River Beauty Loop, Unit 101, Prospect, KY 40059</span>
    <span>Home of Louisville Podcast Studio by Common Ground</span>
  </div>
</footer>
<script src="site.js"></script>
'''
def page(fn,title,cur,inner,full=True):
    head=('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="color-scheme" content="light only">\n<title>%s</title>\n%s\n</head>\n<body>\n'%(title,FONTS)) if full else ('<title>%s</title>\n%s\n'%(title,FONTS))
    tail='</body>\n</html>\n' if full else ''
    open(D+'/'+fn,'w').write(head+nav(cur)+inner+FOOT+tail)

def fix(x):
    return (x.replace('href="https://louisvillepodcast.studio/"','href="podcast.html"')
             .replace('href="#plans"','href="memberships.html"'))

# HOME
home='''  <header class="home-intro">
    <h1>Work. Record. <em>Belong.</em></h1>
    <p>Coworking, a podcast studio and a community, all under one roof in Prospect, KY.</p>
  </header>
  <div class="tiles">
    <a class="tile" href="cowork.html"><img src="lounge-entry.jpg" alt=""><span class="go" aria-hidden="true">→</span><span class="tx"><b>Cowork</b><span>Desks, private offices and meeting rooms.</span></span></a>
    <a class="tile" href="podcast.html"><img src="studio-sofas.jpg" alt=""><span class="go" aria-hidden="true">→</span><span class="tx"><b>Podcast</b><span>Louisville Podcast Studio by Common Ground.</span></span></a>
    <a class="tile" href="community.html"><img src="hero.jpg" alt=""><span class="go" aria-hidden="true">→</span><span class="tx"><b>Community</b><span>Events, members and the people behind it.</span></span></a>
  </div>
  <div class="homeband"><span><b>Visit us</b> · 12100 River Beauty Loop, Unit 101, Prospect, KY</span><a class="btn ghost" href="'''+TOUR+'''">Book a tour <span class="ar">→</span></a></div>
</div>
'''
page('index.html','Common Ground',None,home,full=True)

# COWORK
cow=fix(P['hero'])+'</div>\n\n'+P['ticker']+fix(P['inc'])+fix(P['spaces'])+fix(P['floor'])+fix(P['close'])
page('cowork.html','Cowork · Common Ground','cowork.html',cow)

# MEMBERSHIPS
mem='''</div>
'''+P['plans'].replace('<h2 class="split">Pick your <em>plan.</em></h2>','<h2 class="split">Pick your <em>plan.</em></h2>')+P['steps']+fix(P['close'])
page('memberships.html','Memberships · Common Ground','memberships.html',mem)

# PODCAST
pod='''  <header class="phero">
    <div class="side">
      <span class="label">Louisville Podcast Studio by Common Ground</span>
      <h1>Hit record. <em>We'll handle the rest.</em></h1>
      <p>Cameras, lights, sound and editing, in Prospect and downtown Louisville.</p>
      <div class="actions">
        <a class="btn primary" href="https://louisvillepodcast.studio/book-now">Book a session <span class="ar">→</span></a>
        <a class="btn ghost" href="#locations">Our studios ↓</a>
      </div>
    </div>
    <div class="ph"><img src="studio-crew.jpg" alt="Two hosts recording with cameras and lights"></div>
  </header>
</div>

<section class="spaces">
  <div class="wrap">
    <div class="head rv"><div class="t"><span class="label">What we do</span><h2 class="split">Show up. <em>Sound great.</em></h2></div></div>
    <div class="cards">
      <article class="card rv"><div class="ph"><span class="go" aria-hidden="true">→</span><span class="peek" aria-hidden="true">Take a look</span><img src="studio-chairs.jpg" alt="Two armchairs on a lit studio set"></div><div class="body"><h3>Record</h3><span class="meta">Video and audio</span></div></article>
      <article class="card rv"><div class="ph"><span class="go" aria-hidden="true">→</span><span class="peek" aria-hidden="true">Take a look</span><img src="studio-set.jpg" alt="Two hosts on the living room set"></div><div class="body"><h3>Film</h3><span class="meta">Multiple camera angles</span></div></article>
      <article class="card rv"><div class="ph"><span class="go" aria-hidden="true">→</span><span class="peek" aria-hidden="true">Take a look</span><img src="studio-onair.jpg" alt="Two guests on orange couches under an On Air sign"></div><div class="body"><h3>Edit &amp; clips</h3><span class="meta">Episodes and social clips</span></div></article>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="head rv"><div class="t"><span class="label">In the studio</span><h2 class="split">Lights. Mics. <em>Your story.</em></h2></div></div>
    <div class="bento">
      <figure class="b1 rv"><div class="ph rv-img"><img src="studio-sofas.jpg" alt="Two people talking on orange sofas"></div></figure>
      <figure class="b2 rv"><div class="ph rv-img"><img src="studio-mic.jpg" alt="Guest holding a microphone"></div></figure>
      <figure class="b3 rv"><div class="ph rv-img"><img src="studio-woman.jpg" alt="Guest on an orange couch"></div></figure>
      <figure class="b4 rv"><div class="ph rv-img"><img src="doors-card.jpg" alt="Podcast Studio decal on the front door"></div></figure>
      <figure class="b5 rv"><div class="ph rv-img"><img src="studio-chairs.jpg" alt="Studio set with armchairs"></div></figure>
      <figure class="b6 rv"><div class="ph rv-img"><img src="studio-onair.jpg" alt="On Air sign over the couches"></div></figure>
      <figure class="b7 rv"><div class="ph rv-img"><img src="studio-crew.jpg" alt="Recording with lights and cameras"></div></figure>
    </div>
  </div>
</section>

<section class="steps">
  <div class="wrap">
    <div class="head rv"><div class="t"><span class="label">Kind words</span><h2 class="split">From our <em>guests.</em></h2></div></div>
    <div class="quotes">
      <blockquote class="quote rv"><p>"Exceptional facilities and a supportive team create the perfect environment for podcasting success."</p><cite>Austin P.</cite></blockquote>
      <blockquote class="quote rv"><p>"The studio is beautiful and created for a wonderful experience with our guests. 5 stars."</p><cite>Ina C.</cite></blockquote>
    </div>
  </div>
</section>

<section id="locations">
  <div class="wrap">
    <div class="head rv"><div class="t"><span class="label">Two studios</span><h2 class="split">Pick your <em>stage.</em></h2></div></div>
    <div class="locs">
      <div class="loc rv"><span class="label">Main studio</span><h3>Prospect</h3><p>12100 River Beauty Loop, Unit 101<br>Prospect, KY 40059</p></div>
      <div class="loc rv"><span class="label">Downtown</span><h3>Louisville</h3><p>635 W Main St, 4th Floor<br>Louisville, KY</p></div>
    </div>
  </div>
</section>
'''
page('podcast.html','Podcast Studio · Common Ground','podcast.html',pod)

# COMMUNITY
team=[('Jason Hawkins','Owner & Founder'),('Dr. Ryan Luke','CFO & Principal Executive'),('Faith Miller','Director of Operations & Growth'),('Mackenzie Robbins','Studio & Media Manager'),('Andre Klaassen','Video & Editing Manager'),('Aaron','Title coming soon')]
tl=''.join('<li class="rv"><span class="av" aria-hidden="true">%s</span><div><b>%s</b><span>%s</span></div></li>'%(n.replace('Dr. ','')[0],n,t) for n,t in team)
com='''  <header class="phero">
    <div class="side">
      <span class="label">Community</span>
      <h1>Good work. <em>Good company.</em></h1>
      <p>Workshops, networking nights and a lounge full of people building something.</p>
      <div class="actions">
        <a class="btn primary" href="'''+TOUR+'''">Come say hi <span class="ar">→</span></a>
      </div>
    </div>
    <div class="ph"><img src="hero.jpg" alt="Members gathered in the lounge"></div>
  </header>
</div>

<section class="spaces">
  <div class="wrap">
    <div class="head rv"><div class="t"><span class="label">What's on</span><h2 class="split">Show up. <em>Meet people.</em></h2></div></div>
    <div class="cards">
      <article class="card rv"><div class="ph"><span class="go" aria-hidden="true">→</span><span class="peek" aria-hidden="true">Take a look</span><img src="logowall-247.jpg" alt="Brick logo wall under brass lights"></div><div class="body"><h3>Networking nights</h3><span class="meta">Members and guests</span></div></article>
      <article class="card rv"><div class="ph"><span class="go" aria-hidden="true">→</span><span class="peek" aria-hidden="true">Take a look</span><img src="community.jpg" alt="Three members working at a laptop"></div><div class="body"><h3>Workshops</h3><span class="meta">Trainings and talks</span></div></article>
      <article class="card rv"><div class="ph"><span class="go" aria-hidden="true">→</span><span class="peek" aria-hidden="true">Take a look</span><img src="lounge-card.jpg" alt="Lounge with sofas"></div><div class="body"><h3>Lounge days</h3><span class="meta">Coffee's on</span></div></article>
    </div>
  </div>
</section>

'''+P['say']+'''<section>
  <div class="wrap">
    <div class="head rv"><div class="t"><span class="label">The team</span><h2 class="split">The people <em>behind it.</em></h2></div></div>
    <ul class="team">'''+tl+'''</ul>
  </div>
</section>
'''+fix(P['close'])
page('community.html','Community · Common Ground','community.html',com)
print('ok')
