/** =========================================================*
*   MUFFIN — CINEMATIC PORTFOLIO
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
            .modrinth-button,
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
            .modrinth-button,
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
            .modrinth-button,
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
    *       8. DISCORD + SPOTIFY — SHARED CLOUDFLARE API
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

        // Cloudflare Worker API — shared track for every visitor.
        const SPOTIFY_API =
            "https://muffin-spotify-api.naitikchaudhary-alg.workers.dev/api/spotify";

        async function loadSharedSpotify() {
            if (!spotifyCard) return;

            try {
                const response = await fetch(SPOTIFY_API, {
                    cache: "no-store"
                });

                if (!response.ok) {
                    throw new Error("Spotify API request failed");
                }

                const payload = await response.json();

                const track =
                    payload && payload.available ? payload.track : null;

                if (!track) {
                    if (spotifyTitle) {
                        spotifyTitle.textContent = "No track saved yet";
                    }

                    if (spotifyArtist) {
                        spotifyArtist.textContent =
                            "Spotify activity will appear here";
                    }

                    if (spotifyLabel) {
                        spotifyLabel.textContent = "LAST PLAYED ON SPOTIFY";
                    }

                    return;
                }

                if (spotifyCover) {
                    spotifyCover.src =
                        track.album_art ||
                        "https://placehold.co/128x128/101725/9ba9c8?text=♫";

                    spotifyCover.alt = `Album artwork for ${track.name}`;
                }

                if (spotifyTitle) {
                    spotifyTitle.textContent = track.name || "Unknown track";
                }

                if (spotifyArtist) {
                    spotifyArtist.textContent =
                        track.artist || "Unknown artist";

                    if (track.album) {
                        spotifyArtist.textContent += ` · ${track.album}`;
                    }
                }

                if (spotifyLabel) {
                    spotifyLabel.textContent = "LAST PLAYED ON SPOTIFY";
                }

                if (track.url) {
                    spotifyCard.href = track.url;
                }

                if (spotifyProgress) {
                    spotifyProgress.style.width = "0%";
                }

            } catch (error) {
                console.warn(
                    "Could not load shared Spotify track:",
                    error
                );

                if (spotifyLabel) {
                    spotifyLabel.textContent = "SPOTIFY ACTIVITY";
                }

                if (spotifyTitle) {
                    spotifyTitle.textContent = "Unable to load track";
                }

                if (spotifyArtist) {
                    spotifyArtist.textContent =
                        "Please try again shortly";
                }
            }
        }

        // Load immediately and refresh every 60 seconds.
        loadSharedSpotify();
        setInterval(loadSharedSpotify, 60000);

        /** DISCORD PRESENCE **/

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
    })();

    /** =====================================================*
    *       9. COPY EMAIL
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

})();
