# Hi, I'm Si Wang (王斯)

I am a Ph.D. student in the College of Control Science and Engineering at Zhejiang University, advised by Prof. [Yue Wang](https://ywang-zju.github.io/) and Prof. [Rong Xiong](https://person.zju.edu.cn/en/rongxiong).

My research interests include robotics, perception, localization, and world models. I work on learning-based localization and sensor fusion for robots operating in real-world environments.

[Homepage](https://hiones.github.io/) · [Email](mailto:12532114@zju.edu.cn) · [GitHub](https://github.com/HiOnes) · [Google Scholar](https://scholar.google.com/citations?user=sQlwQc0AAAAJ&hl=zh-CN)

## Selected Publications

- **AnyAmber: A Generalist for Versatile Anonymous Bearing and Range Based Position Tracking**  
  **Si Wang**, Yanmei Jiao, Yanjun Cao, Rong Xiong, Yue Wang  
  Robotics: Science and Systems (RSS), 2026.<br>
  [PDF](https://roboticsproceedings.org/rss22/p168.pdf) · [Proceedings](https://roboticsproceedings.org/rss22/p168.html) · [Code](https://github.com/HiOnes/AnyAmber)

- **Neural Ranging Inertial Odometry**  
  **Si Wang**, Bingqi Shen, Fei Wang, Yanjun Cao, Rong Xiong, Yue Wang  
  IEEE International Conference on Robotics and Automation (ICRA), 2025.<br>
  [PDF](https://arxiv.org/pdf/2512.10531) · [arXiv](https://arxiv.org/abs/2512.10531) · [DOI](https://doi.org/10.1109/ICRA55743.2025.11128550)

- **Mr. Virgil: Learning Multi-robot Visual-range Relative Localization**  
  **Si Wang**, Zhehan Li, Jiadong Lu, Rong Xiong, Yanjun Cao, Yue Wang  
  IEEE/RSJ International Conference on Intelligent Robots and Systems (IROS), 2025.<br>
  [PDF](https://arxiv.org/pdf/2512.10540) · [arXiv](https://arxiv.org/abs/2512.10540) · [Code](https://github.com/HiOnes/Mr-Virgil) · [DOI](https://doi.org/10.1109/IROS60139.2025.11247592)

- **Sparse Hierarchical LiDAR Bundle Adjustment for Online Collaborative Localization and Mapping**  
  Jiangpin Liu, Xuecheng Xu, Sha Lu, **Si Wang**, Chaoqun Wang, Rong Xiong, Yue Wang  
  IEEE Robotics and Automation Letters, 10(6): 5561-5568, 2025.  
  [IEEE Xplore](https://ieeexplore.ieee.org/document/10947501/) · [DBLP](https://dblp.org/rec/journals/ral/LiuXLWWXW25)

## News

- **2026.07**: AnyAmber was published in the proceedings of RSS 2026. [Paper](https://roboticsproceedings.org/rss22/p168.html)
- **2026.04**: AnyAmber was accepted to Robotics: Science and Systems 2026 (RSS 2026).
- **2025.06**: Mr. Virgil was accepted to IEEE/RSJ International Conference on Intelligent Robots and Systems 2025 (IROS 2025).
- **2025.06**: Sparse Hierarchical LiDAR Bundle Adjustment was published in IEEE Robotics and Automation Letters 2025 (RA-L 2025).
- **2025.01**: Neural Ranging Inertial Odometry was accepted to IEEE International Conference on Robotics and Automation 2025 (ICRA 2025).
- **2023.07**: ZJUNlict won the RoboCup China Open 2023 Small Size League championship and the RoboCup 2023 Small Size League world runner-up.

## Local Preview and Maintenance

Open `index.html` directly in a browser. No build, server, CDN, or package installation is needed to view the site.

- Layout A (`classic`) is the selected default homepage. Layout B remains available at `?layout=sidebar` for comparison; `?layout=classic` explicitly selects A.
- Language: `?lang=en` or `?lang=zh`. An explicit URL choice takes priority over the saved language; first-time visitors see English. Storage is optional.
- English content lives in `index.html`; Chinese translations live in `assets/site.js`. Keep both updated together. Paper titles and author lists retain their published spelling.
- Paper PDFs are hosted by RSS or arXiv. The RA-L paper links to IEEE Xplore and DBLP. Local paper, overview, and poster PDFs have been removed; ignore rules prevent them from being reintroduced accidentally.
- AnyAmber uses the original [experiment animation](https://github.com/HiOnes/AnyAmber/blob/main/assets/experiment-demo.gif) from its code repository, stored as `assets/anyamber-experiment.gif` (697 x 480, approximately 7.6 MB). It loads lazily and supports the same image enlargement as the other figures.
- `.preview/` contains the local A/B comparison pages and screenshots and is excluded from publication.
- `resume.pdf` contains private contact details and must remain untracked and unlinked.

### Verification

With Playwright available in your Node environment, run `node tests/preview.cjs`. It verifies both layouts in English and Chinese at 390px, 772px, and 1440px, checks GIF playback, exercises language persistence and image dialogs, and saves screenshots under `.preview/screenshots/`. Set `NODE_PATH` if using a bundled Playwright installation, and `BROWSER_CHANNEL=chrome` to use an installed Google Chrome instead of Playwright Chromium. The tests use local files and do not require a server.
