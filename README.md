# 🏆 SportsTicker: The Ultimate Mancave Broadcast Dashboard

A lightweight, automated sports ticker and scoreboard designed for 24/7 background broadcast on home TVs, second monitors, or digital signage (like Yodeck). 

Inspired by professional sports networks, this dashboard cycles through live scores, recent results, and upcoming fixtures without requiring any manual interaction or scrolling.

![License](https://img.shields.io/github/license/Nufan14/SportsTicker)
![Stars](https://img.shields.io/github/stars/Nufan14/SportsTicker)

## 📺 Live Demo
**[Click here to view the Live Broadcast Feed](https://nufan14.github.io/SportsTicker/autorun.html)** *(Best viewed in Fullscreen mode by pressing **F11**)*

## ✨ Features
* **Fully Automated:** Cycles through leagues and updates scores in real-time using public APIs.
* **Smart Layout:** "Live" sections only appear when games are in progress, keeping the screen clean.
* **Customizable Branding:** High-resolution background watermarks for NBA, NFL, NHL, and UCL.
* **Broad Sport Coverage:** Support for European Soccer (EPL, La Liga, UCL), NBA, NFL, and NHL.
* **Mancave Optimized:** Designed to look like a professional studio ticker with high-contrast headers and "Euro-style" Home vs. Away formatting.

## 🛠️ How to Customize
If you want to change the timing of the cycle or the specific leagues displayed:
1. **Clone the Repo:** Download the files to your local machine.
2. **Adjust Opacity:** In the `<style>` block of each HTML file, look for `.centered-logo` and change the `opacity` (e.g., `0.55`) to suit your specific TV brightness.
3. **Change League URLs:** Update the `url` variable in the `update()` function within the `<script>` tag to target different ESPN API endpoints.

## 🚀 Deployment
This project is built with simple HTML/CSS/JS. You can host it yourself via **GitHub Pages**, or simply open the local `.html` files in any modern web browser. 

For the best experience on a TV (like an Onn 4k or FireStick), we recommend using **Yodeck** or a similar digital signage tool to manage the URL stream.

## 🙏 Credits
Modified and enhanced from the original work of [Laraiyeo](https://obsproject.com/forum/resources/live-sports-tracker.2139/) and [SebPartof2](https://github.com/SebPartof2/SNN-Sports).
