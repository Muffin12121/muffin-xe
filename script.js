/** =========================================================*
*   MUFFIN — ABOUT ME
*   Three.js + Earth + Geometry + GSAP + Discord + Spotify
*========================================================= **/

(() => {
    "use strict";

    /** =====================================================*
    *       1. THREE.JS — 3D BACKGROUND
    *===================================================== **/

    if (typeof THREE !== "undefined") {
        const canvas = document.querySelector("#webgl");

        if (canvas) {
            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(
                42,
                window.innerWidth / window.innerHeight,
                0.1,
                100
            );

            camera.position.z = 8;

            const renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
                powerPreference: "high-performance"
            });

            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.outputEncoding = THREE.sRGBEncoding;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.1;

            scene.add(new THREE.AmbientLight(0xffffff, 0.65));

            const mainLight = new THREE.PointLight(0xffffff, 2.2, 30);
            mainLight.position.set(4, 3, 6);
            scene.add(mainLight);

            const blueLight = new THREE.PointLight(0x456ebc, 1.5, 25);
            blueLight.position.set(-5, -2, 2);
            scene.add(blueLight);

            /** EARTH **/

            const earthGroup = new THREE.Group();
            scene.add(earthGroup);

            const earthTiltGroup = new THREE.Group();
            earthGroup.add(earthTiltGroup);

            const earthSpinGroup = new THREE.Group();
            earthTiltGroup.add(earthSpinGroup);

            earthSpinGroup.rotation.y = -1.65;

            const earthGeometry = new THREE.SphereGeometry(1.7, 128, 128);

            const earthMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.95,
                metalness: 0
            });

            const earth = new THREE.Mesh(earthGeometry, earthMaterial);
            earthSpinGroup.add(earth);

            /** EARTH TEXTURE **/

            const textureLoader = new THREE.TextureLoader();
            textureLoader.setCrossOrigin("anonymous");

            textureLoader.load(
                "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
                (texture) => {
                    texture.encoding = THREE.sRGBEncoding;
                    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                    earth.material.map = texture;
                    earth.material.needsUpdate = true;
                    canvas.style.opacity = "1";
                },
                undefined,
                () => {
                    console.warn("Earth texture failed to load.");
                    canvas.style.opacity = "1";
                }
            );

            /** ATMOSPHERE **/

            const atmosphere = new THREE.Mesh(
                new THREE.SphereGeometry(1.76, 96, 96),
                new THREE.MeshBasicMaterial({
                    color: 0x527dcc,
                    transparent: true,
                    opacity: 0.12,
                    side: THREE.BackSide
                })
            );

            earthSpinGroup.add(atmosphere);

            const outerGlow = new THREE.Mesh(
                new THREE.SphereGeometry(1.82, 64, 64),
                new THREE.MeshBasicMaterial({
                    color: 0x315b9e,
                    transparent: true,
                    opacity: 0.045,
                    side: THREE.BackSide
                })
            );

            earthSpinGroup.add(outerGlow);

            /** ORBITAL RINGS **/

            const orbitGroup = new THREE.Group();
            earthTiltGroup.add(orbitGroup);

            function createOrbit(radius, rotationX, rotationY, opacity) {
                const geometry = new THREE.TorusGeometry(
                    radius,
                    0.0045,
                    8,
                    260
                );

                const material = new THREE.MeshBasicMaterial({
                    color: 0xc5d2ed,
                    transparent: true,
                    opacity
                });

                const ring = new THREE.Mesh(geometry, material);
                ring.rotation.x = rotationX;
                ring.rotation.y = rotationY;
                orbitGroup.add(ring);
            }

            createOrbit(2.18, 1.1, 0.25, 0.48);
            createOrbit(2.38, 0.55, 1.0, 0.27);
            createOrbit(2.58, 1.45, 0.5, 0.18);

            /** SATELLITE **/

            const satellite = new THREE.Mesh(
                new THREE.SphereGeometry(0.045, 24, 24),
                new THREE.MeshStandardMaterial({
                    color: 0xe1e7f2,
                    metalness: 0.7,
                    roughness: 0.25
                })
            );

            orbitGroup.add(satellite);

            /** FLOATING GEOMETRIC SHAPES **/

            const geometricGroup = new THREE.Group();
            scene.add(geometricGroup);

            const geometricMaterials = [
                new THREE.MeshBasicMaterial({
                    color: 0x8da9dc,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.35
                }),
                new THREE.MeshBasicMaterial({
                    color: 0xd5dff2,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.25
                }),
                new THREE.MeshBasicMaterial({
                    color: 0x5479b8,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.3
                })
            ];

            const geometricObjects = [];

            function addFloatingShape(
                geometry,
                x,
                y,
                z,
                scale,
                speed
            ) {
                const material = geometricMaterials[
                    Math.floor(Math.random() * geometricMaterials.length)
                ];

                const shape = new THREE.Mesh(geometry, material);

                shape.position.set(x, y, z);
                shape.scale.setScalar(scale);

                shape.userData = {
                    baseX: x,
                    baseY: y,
                    rotationSpeed: speed,
                    floatSpeed: Math.random() * 0.8 + 0.4,
                    floatOffset: Math.random() * Math.PI * 2,
                    driftOffset: Math.random() * Math.PI * 2
                };

                geometricGroup.add(shape);
                geometricObjects.push(shape);
            }

            //* No TorusKnotGeometry — removed the twisted white shape.*

            addFloatingShape(
                new THREE.IcosahedronGeometry(0.55, 1),
                -3.8, 1.7, -1, 0.8, 0.003
            );

            addFloatingShape(
                new THREE.OctahedronGeometry(0.6),
                4.2, -1.5, -2, 0.9, 0.004
            );

            addFloatingShape(
                new THREE.TetrahedronGeometry(0.65),
                -4.5, -2.2, -1, 0.7, 0.002
            );

            addFloatingShape(
                new THREE.IcosahedronGeometry(0.3, 0),
                0, 3, -3, 0.65, 0.005
            );

            addFloatingShape(
                new THREE.OctahedronGeometry(0.35),
                5, 0.8, -4, 0.7, 0.004
            );

            addFloatingShape(
                new THREE.TorusGeometry(0.42, 0.025, 8, 80),
                -5, 0.1, -3, 0.9, 0.003
            );

            addFloatingShape(
                new THREE.IcosahedronGeometry(0.22, 1),
                1.2, -3, -2, 0.8, 0.004
            );

            /** PARTICLES **/

            const particleCount = 1100;
            const positions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                const index = i * 3;

                positions[index] = (Math.random() - 0.5) * 25;
                positions[index + 1] = (Math.random() - 0.5) * 18;
                positions[index + 2] = (Math.random() - 0.5) * 15;
            }

            const particleGeometry = new THREE.BufferGeometry();

            particleGeometry.setAttribute(
                "position",
                new THREE.BufferAttribute(positions, 3)
            );

            const particles = new THREE.Points(
                particleGeometry,
                new THREE.PointsMaterial({
                    color: 0xcbd8f2,
                    size: 0.016,
                    transparent: true,
                    opacity: 0.55,
                    sizeAttenuation: true
                })
            );

            scene.add(particles);

            /** RESPONSIVE POSITIONING **/

            function updateSceneLayout() {
                const mobile = window.innerWidth < 768;

                if (mobile) {
                    camera.position.z = 10;
                    earthGroup.position.set(1.8, -0.1, -1);
                    earthGroup.scale.setScalar(0.68);
                    geometricGroup.scale.setScalar(0.65);
                } else {
                    camera.position.z = 8;
                    earthGroup.position.set(3.1, 0, -0.8);
                    earthGroup.scale.setScalar(0.88);
                    geometricGroup.scale.setScalar(0.9);
                }

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            updateSceneLayout();

            /** MOUSE MOVEMENT **/

            let mouseX = 0;
            let mouseY = 0;

            window.addEventListener("pointermove", (event) => {
                mouseX = (event.clientX / window.innerWidth - 0.5) * 0.2;
                mouseY = (event.clientY / window.innerHeight - 0.5) * 0.16;
            });

            /** ANIMATION **/

            const clock = new THREE.Clock();

            function animate() {
                const delta = Math.min(clock.getDelta(), 0.05);
                const elapsed = clock.elapsedTime;

                //* Earth rotation*
                earth.rotation.y += delta * 0.12;

                //* Orbital rings*
                orbitGroup.rotation.y += delta * 0.08;
                orbitGroup.rotation.x += delta * 0.015;

                //* Satellite*
                satellite.position.x = Math.cos(elapsed * 0.65) * 2.18;
                satellite.position.z = Math.sin(elapsed * 0.65) * 2.18;
                satellite.position.y = Math.sin(elapsed * 0.4) * 0.25;

                //* Earth tilt*
                earthTiltGroup.rotation.x +=
                    (mouseY - earthTiltGroup.rotation.x) * 0.015;

                earthTiltGroup.rotation.z +=
                    (-mouseX - earthTiltGroup.rotation.z) * 0.015;

                //* Geometric shapes*
                geometricObjects.forEach((shape) => {
                    const data = shape.userData;

                    shape.rotation.x += delta * data.rotationSpeed * 12;
                    shape.rotation.y += delta * data.rotationSpeed * 10;
                    shape.rotation.z += delta * data.rotationSpeed * 6;

                    shape.position.y =
                        data.baseY +
                        Math.sin(
                            elapsed * data.floatSpeed + data.floatOffset
                        ) * 0.3;

                    shape.position.x =
                        data.baseX +
                        Math.sin(
                            elapsed * 0.2 + data.driftOffset
                        ) * 0.12;
                });

                //* Particles*
                particles.rotation.y = elapsed * 0.012;
                particles.rotation.x = Math.sin(elapsed * 0.15) * 0.025;

                renderer.render(scene, camera);
            }

            renderer.setAnimationLoop(animate);

            /** RESIZE **/

            let resizeTimeout;

            window.addEventListener("resize", () => {
                clearTimeout(resizeTimeout);

                resizeTimeout = setTimeout(() => {
                    updateSceneLayout();

                    if (typeof ScrollTrigger !== "undefined") {
                        ScrollTrigger.refresh();
                    }
                }, 150);
            });
        }
    }

    /** =====================================================*
    *       2. ANIMATION SETTINGS
    *===================================================== **/

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const isTouchDevice = window.matchMedia(
        "(pointer: coarse)"
    ).matches;

    /** =====================================================*
    *       3. GSAP — CINEMATIC ANIMATIONS
    *===================================================== **/

    if (typeof gsap !== "undefined" && !prefersReducedMotion) {
        if (typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        gsap.from(".navbar", {
            y: -35,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        });

        document.querySelectorAll(
            ".hero-content, .profile-row, .hero-heading, .heading-line, .intro-description"
        ).forEach((element) => {
            element.style.opacity = "1";
            element.style.visibility = "visible";
            element.style.transform = "none";
        });

        gsap.from(".profile-row", {
            y: 24,
            opacity: 0,
            duration: 1,
            delay: 0.15,
            ease: "power4.out"
        });

        gsap.from(".heading-line", {
            y: 35,
            opacity: 0,
            duration: 1.05,
            stagger: 0.09,
            delay: 0.2,
            ease: "power4.out"
        });

        gsap.from(".intro-description", {
            y: 18,
            opacity: 0,
            duration: 1,
            delay: 0.75,
            ease: "power3.out"
        });

        if (typeof ScrollTrigger !== "undefined") {
            const revealGroups = [
                ".projects-heading",
                ".project-item",
                ".vibe-heading",
                ".vibe-card",
                ".contact-content",
                ".about-content",
                ".about-details > div"
            ];

            revealGroups.forEach((selector) => {
                const elements = gsap.utils.toArray(selector);

                elements.forEach((element, index) => {
                    gsap.fromTo(
                        element,
                        {
                            y: 35,
                            opacity: 0,
                            filter: "blur(8px)"
                        },
                        {
                            y: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                            duration: 1.05,
                            delay: Math.min(index * 0.08, 0.3),
                            ease: "power4.out",
                            scrollTrigger: {
                                trigger: element,
                                start: "top 88%",
                                once: true
                            }
                        }
                    );
                });
            });

            gsap.utils.toArray(".section-label").forEach((element) => {
                gsap.from(element, {
                    x: -22,
                    opacity: 0,
                    duration: 0.85,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%",
                        once: true
                    }
                });
            });
        }
    }
        /** =====================================================*
    *       4. LIQUID GLASS — MOUSE REFLECTION
    *===================================================== **/

    if (!isTouchDevice) {
        const glassElements = document.querySelectorAll(`
            .discord-card,
            .project-item,
            .vibe-card,
            .spotify-card,
            .primary-button,
            .contact-email,
            .contact-discord
        `);

        glassElements.forEach((element) => {
            element.addEventListener("pointermove", (event) => {
                const rect = element.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                element.style.setProperty("--mouse-x", `${x}px`);
                element.style.setProperty("--mouse-y", `${y}px`);
            });

            element.addEventListener("pointerleave", () => {
                element.style.setProperty("--mouse-x", "50%");
                element.style.setProperty("--mouse-y", "50%");
            });
        });
    }

    /** =====================================================*
    *       5. 3D TILT — GLASS CARDS
    *===================================================== **/

    if (!isTouchDevice && !prefersReducedMotion) {
        const tiltCards = document.querySelectorAll(`
            .discord-card,
            .project-item,
            .vibe-card,
            .spotify-card
        `);

        tiltCards.forEach((card) => {
            let frame;

            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 7;
                const rotateX = (0.5 - y) * 7;

                cancelAnimationFrame(frame);

                frame = requestAnimationFrame(() => {
                    card.style.transform =
                        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                });
            });

            card.addEventListener("pointerleave", () => {
                cancelAnimationFrame(frame);
                card.style.transform = "";
            });
        });
    }

    /** =====================================================*
    *       6. MAGNETIC BUTTONS
    *===================================================== **/

    if (!isTouchDevice && !prefersReducedMotion) {
        const magneticButtons = document.querySelectorAll(`
            .primary-button,
            .nav-contact,
            #copy-email
        `);

        magneticButtons.forEach((button) => {
            button.addEventListener("pointermove", (event) => {
                const rect = button.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;

                button.style.transform =
                    `translate(${x * 0.1}px, ${y * 0.12}px)`;
            });

            button.addEventListener("pointerleave", () => {
                button.style.transform = "";
            });
        });
    }

    /** =====================================================*
    *       7. SMOOTH ANCHOR NAVIGATION
    *===================================================== **/

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });
        /** =====================================================*
    *       8. DISCORD + SPOTIFY — LANYARD
    *===================================================== **/

    (() => {
        const DISCORD_ID = "1272488980046155868";

        const avatar = document.getElementById("discord-avatar");
        const statusText = document.getElementById("discord-status-text");
        const statusDot = document.getElementById("discord-status-dot");

        const spotifyCard = document.getElementById("spotify-card");
        const spotifyCover = document.getElementById("spotify-cover");
        const spotifyTitle = document.getElementById("spotify-title");
        const spotifyArtist = document.getElementById("spotify-artist");
        const spotifyLabel = document.getElementById("spotify-label");
        const spotifyProgress = document.getElementById("spotify-progress-fill");

        const statusLabels = {
            online: "Online",
            idle: "Idle",
            dnd: "Do Not Disturb",
            offline: "Offline"
        };

        function showStatus(status) {
            if (!statusText || !statusDot) return;

            const normalized = statusLabels[status] ? status : "offline";

            statusText.textContent = statusLabels[normalized];
            statusDot.className = "discord-status-dot is-" + normalized;
        }

        const SPOTIFY_API =
            "https://muffin-spotify-api.naitikchaudhary-alg.workers.dev/api/spotify";

        const LANYARD_USER_API =
            `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;

        let currentTrackKey = null;
        let progressTimer = null;
        let lastPlayedRequest = null;
        let liveSpotifyActive = false;

        function stopProgress() {
            if (progressTimer) {
                clearInterval(progressTimer);
                progressTimer = null;
            }
        }

        function setSpotifyProgress(start, end) {
            stopProgress();

            if (!spotifyProgress) return;

            if (!start || !end || end <= start) {
                spotifyProgress.style.width = "0%";
                return;
            }

            const update = () => {
                const percentage = Math.min(
                    100,
                    Math.max(
                        0,
                        ((Date.now() - start) / (end - start)) * 100
                    )
                );

                spotifyProgress.style.width = `${percentage}%`;
            };

            update();
            progressTimer = setInterval(update, 1000);
        }

        function displayTrack(track, isLive = false) {
            if (!track || !spotifyCard) return;

            const name = track.song || track.name || "Unknown track";
            const artist = track.artist || "Unknown artist";
            const album = track.album || "";

            const image =
                track.album_art_url ||
                track.album_art ||
                "https://placehold.co/128x128/101725/9ba9c8?text=♫";

            const trackId = track.track_id || track.id || "";

            const trackUrl = trackId
                ? `https://open.spotify.com/track/${encodeURIComponent(trackId)}`
                : (track.url || "https://open.spotify.com/");

            const key = `${trackId}|${name}|${artist}`;

            if (key !== currentTrackKey) {
                currentTrackKey = key;
            }

            if (spotifyCover) {
                spotifyCover.src = image;
                spotifyCover.alt = `Album artwork for ${name}`;
            }

            if (spotifyTitle) {
                spotifyTitle.textContent = name;
            }

            if (spotifyArtist) {
                spotifyArtist.textContent = album
                    ? `${artist} · ${album}`
                    : artist;
            }

            if (spotifyLabel) {
                spotifyLabel.textContent = isLive
                    ? "NOW PLAYING ON SPOTIFY"
                    : "LAST PLAYED ON SPOTIFY";
            }

            spotifyCard.href = trackUrl;

            if (isLive && track.timestamps) {
                setSpotifyProgress(
                    track.timestamps.start,
                    track.timestamps.end
                );
            } else {
                stopProgress();

                if (spotifyProgress) {
                    spotifyProgress.style.width = "0%";
                }
            }
        }

        async function loadLastPlayedSpotify() {
            if (!spotifyCard || liveSpotifyActive) return;
            if (lastPlayedRequest) return lastPlayedRequest;

            lastPlayedRequest = (async () => {
                try {
                    const response = await fetch(
                        `${SPOTIFY_API}?t=${Date.now()}`,
                        { cache: "no-store" }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `Spotify API returned ${response.status}`
                        );
                    }

                    const payload = await response.json();

                    if (liveSpotifyActive) return;

                    const track =
                        payload && payload.available
                            ? payload.track
                            : null;

                    if (track) {
                        displayTrack(track, false);
                    } else {
                        stopProgress();

                        if (spotifyLabel) {
                            spotifyLabel.textContent = "SPOTIFY ACTIVITY";
                        }

                        if (spotifyTitle) {
                            spotifyTitle.textContent = "Nothing playing";
                        }

                        if (spotifyArtist) {
                            spotifyArtist.textContent =
                                "Your last played track will appear here";
                        }

                        if (spotifyProgress) {
                            spotifyProgress.style.width = "0%";
                        }
                    }
                } catch (error) {
                    console.warn(
                        "Could not load last-played Spotify track:",
                        error
                    );

                    if (!liveSpotifyActive && spotifyTitle) {
                        spotifyTitle.textContent = "Unable to load track";
                    }
                } finally {
                    lastPlayedRequest = null;
                }
            })();

            return lastPlayedRequest;
        }

        function updateSpotify(spotify) {
            if (spotify && spotify.song) {
                liveSpotifyActive = true;
                displayTrack(spotify, true);
                return;
            }

            liveSpotifyActive = false;
            stopProgress();

            // When playback stops, show the most recently saved track from D1.
            loadLastPlayedSpotify();
        }

        // Load a saved track immediately; the live Lanyard socket takes priority.
        loadLastPlayedSpotify();

        // Refresh the saved fallback periodically.
        setInterval(() => {
            if (!liveSpotifyActive) {
                loadLastPlayedSpotify();
            }
        }, 30000);

        function updatePresence(data) {
            if (!data) return;

            if (data.discord_user && avatar) {
                const user = data.discord_user;

                if (user.avatar) {
                    avatar.src =
                        `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}.png?size=128`;
                }
            }

            showStatus(data.discord_status || "offline");
            updateSpotify(data.spotify);
        }

        if (avatar) {
            avatar.addEventListener("error", () => {
                avatar.src =
                    "https://cdn.discordapp.com/embed/avatars/0.png";
            }, { once: true });
        }

        let socket;
        let heartbeatTimer;
        let reconnectTimer;

        function connect() {
            if (!("WebSocket" in window)) return;

            socket = new WebSocket("wss://api.lanyard.rest/socket");

            socket.addEventListener("message", (event) => {
                let packet;

                try {
                    packet = JSON.parse(event.data);
                } catch {
                    return;
                }

                if (packet.op === 1) {
                    clearInterval(heartbeatTimer);

                    heartbeatTimer = setInterval(() => {
                        if (
                            socket &&
                            socket.readyState === WebSocket.OPEN
                        ) {
                            socket.send(JSON.stringify({ op: 3 }));
                        }
                    }, packet.d.heartbeat_interval);

                    socket.send(JSON.stringify({
                        op: 2,
                        d: {
                            subscribe_to_id: DISCORD_ID
                        }
                    }));
                }

                if (packet.op === 0 && packet.d) {
                    updatePresence(packet.d);
                }
            });

            socket.addEventListener("close", scheduleReconnect);

            socket.addEventListener("error", () => {
                showStatus("offline");

                if (socket) {
                    socket.close();
                }
            });
        }

        function scheduleReconnect() {
            clearInterval(heartbeatTimer);
            clearTimeout(reconnectTimer);

            showStatus("offline");

            reconnectTimer = setTimeout(connect, 5000);
        }

        connect();

        fetch(LANYARD_USER_API, { cache: "no-store" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Lanyard returned ${response.status}`);
                }

                return response.json();
            })
            .then((payload) => {
                if (payload && payload.success && payload.data) {
                    updatePresence(payload.data);
                }
            })
            .catch((error) => {
                console.warn(
                    "Could not load initial Lanyard presence:",
                    error
                );
            });
    })();

    /** =====================================================*
    *       9. PROJECT & EXPERIENCE MODALS
    *===================================================== **/

    (() => {
        const content = {
            experiences: {
                modal: "experiences-modal", details: "experiences-details",
                entries: [
                    { name: "Blitz Tierlist", role: "Moderator", points: ["Handled support tickets and member queries.", "Managed overall server chat and community interactions.", "Conducted high-tier tests."] },
                    { name: "Alpine Tierlist", role: "Moderator", points: ["Handled support tickets.", "Managed overall server chat and member interactions.", "Assisted with high-tier testing."] },
                    { name: "Discord Python Hub", role: "Community Moderator", points: ["Helped programmers with Python-related questions.", "Assisted members with coding problems and technical discussions.", "Moderated community interactions."] },
                    { name: "Adorability", role: "Server Oversight", points: ["Oversaw the entire server and its overall operations."] }
                ]
            },
            creations: {
                modal: "creations-modal", details: "creations-details",
                entries: [
                    { name: "Dusk Discord Bot", role: "MULTIPURPOSE DISCORD BOT", points: ["Built a multipurpose Discord bot for server management.", "Included moderation, welcome, autorole and boost features.", "Developed utilities and automation for Discord communities."] },
                    { name: "Kraven Discord Bot", role: "DISCORD BOT", points: ["Developed bot features and utilities for the Kraven community.", "Worked on ticket management and staff-focused tools.", "Supported community operations and server workflows."] },
                    { name: "Muffin Chan Discord Bot", role: "SOLD TO A DEVELOPER TEAM", points: ["Built as a more feature-rich bot, with roughly twice the scope of Dusk.", "Included custom messages and server automation.", "Featured anti-nuke protection to help safeguard servers."] },
                    { name: "Dusk Minecraft Client", role: "SOLD TO A DEVELOPER TEAM", points: ["Designed a custom Minecraft launcher using C# and WPF.", "Planned profile management, Minecraft versions and Fabric/Forge support.", "Included mod management and performance configuration in the launcher concept."] }
                ]
            },
            kraven: {
                modal: "kraven-modal", details: "kraven-details",
                entries: [
                    { name: "Co-Founder", role: "PROJECT LEADERSHIP", points: ["Co-founded the Kraven project and helped build its community."] },
                    { name: "Bot Manager", role: "BOT MANAGEMENT", points: ["Manage and oversee the Kraven Discord bot.", "Handle bot configuration, features and development.", "Maintain bot functionality and coordinate updates."] }
                ]
            }
        };

        let activeModal = null;
        let previousFocus = null;

        function closeModal() {
            if (!activeModal) return;
            activeModal.classList.remove("is-open");
            activeModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("experience-modal-open");
            activeModal = null;
            if (previousFocus) previousFocus.focus();
        }

        function openModal(key, trigger) {
            const config = content[key];
            if (!config) return;
            const modal = document.getElementById(config.modal);
            const details = document.getElementById(config.details);
            if (!modal || !details) return;

            previousFocus = trigger;
            details.replaceChildren(...config.entries.map((entry, index) => {
                const article = document.createElement("article");
                article.className = "experience-entry";
                article.style.setProperty("--entry-index", index);
                const heading = document.createElement("div");
                heading.className = "experience-entry-heading";
                const name = document.createElement("h4");
                name.textContent = `${String(index + 1).padStart(2, "0")} / ${entry.name}`;
                const role = document.createElement("span");
                role.textContent = entry.role;
                heading.append(name, role);
                const list = document.createElement("ul");
                entry.points.forEach((point) => {
                    const item = document.createElement("li");
                    item.textContent = point;
                    list.append(item);
                });
                article.append(heading, list);
                return article;
            }));

            activeModal = modal;
            modal.classList.add("is-open");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("experience-modal-open");
            modal.querySelector(".experience-close").focus();
        }

        document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
            trigger.addEventListener("click", (event) => {
                event.preventDefault();
                openModal(trigger.dataset.openModal, trigger);
            });
        });
        document.querySelectorAll("[data-close-modal]").forEach((control) => {
            control.addEventListener("click", closeModal);
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeModal();
        });
    })();

    /** =====================================================*
    *       10. COPY EMAIL
    *===================================================== **/

    (() => {
        const copyButton = document.getElementById("copy-email");

        if (!copyButton) return;

        copyButton.addEventListener("click", async () => {
            const email = "muffinexe.dev@gmail.com";

            try {
                await navigator.clipboard.writeText(email);
                copyButton.textContent = "COPIED!";
            } catch {
                copyButton.textContent = "COPY FAILED";
            }

            setTimeout(() => {
                copyButton.textContent = "COPY";
            }, 1800);
        });
    })();


    /** Smooth custom cursor: soft glow + lagging glass ring */
    (() => {
        const finePointer = window.matchMedia("(pointer: fine)").matches;
        if (!finePointer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const glow = document.createElement("div");
        glow.className = "cursor-glow";
        const ring = document.createElement("div");
        ring.className = "cursor-ring";
        const dot = document.createElement("div");
        dot.className = "cursor-dot";
        document.body.append(glow, ring, dot);

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let ringX = targetX;
        let ringY = targetY;
        let pointerInside = false;

        const move = (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
            pointerInside = true;
            document.body.classList.add("cursor-ready");
            dot.style.left = `${targetX}px`;
            dot.style.top = `${targetY}px`;
            glow.style.left = `${targetX}px`;
            glow.style.top = `${targetY}px`;
        };

        const animate = () => {
            ringX += (targetX - ringX) * 0.16;
            ringY += (targetY - ringY) * 0.16;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            requestAnimationFrame(animate);
        };

        window.addEventListener("pointermove", move, { passive: true });
        window.addEventListener("pointerleave", () => {
            pointerInside = false;
            document.body.classList.remove("cursor-ready");
        });
        document.addEventListener("pointerover", (event) => {
            if (event.target.closest("a, button, [role='button'], input, textarea, select")) {
                document.body.classList.add("cursor-hover");
            }
        });
        document.addEventListener("pointerout", (event) => {
            if (event.target.closest("a, button, [role='button'], input, textarea, select")) {
                document.body.classList.remove("cursor-hover");
            }
        });

        animate();
    })();

})();
