# Test 3<br><small>[Merging 4 shaders in one]</small>

<img src="diagram.png">



### Run №1

* NVIDIA GeForce GTX 1660 Ti + ANGLE(Direct3D11)
* Resolution 1536x864 (1920x1080)
* Jan 1, 2024

| Renderings | A fps | B fps | Gain |
| :-: | :-: | :-: | :-: |
| 1 | 144 | 144 | +0% |
| 2 | 144 | 144 | +0% |
| 4 | 144 | 144 | +0% |
| 8 | 144 | 144 | +0% |
| 16 | 101 | 144 | +43% |
| 32 | 50.9 | 87.9 | +73% |
| 64 | 25.7 | 44.6 | +73% |
| 128 | 12.9 | 22.5 | +75% |
| 256 | 6.50 | 11.3 | +74% |
| 512 | 2.90 | 5.68 | +96% |
| 1024 | 1.67 | 2.85 | +70% |



### Run №2

* Intel UHD Graphics 630 + ANGLE(Direct3D11)
* Resolution 1536x864 (1920x1080)
* Jan 1, 2024

| Renderings | A fps | B fps | Gain |
| :-: | :-: | :-: | :-: |
| 1 | 91.0 | 130 | +43% |
| 2 | 52.8 | 85.3 | +62% |
| 4 | 28.8 | 49.6 | +72% |
| 8 | 15.6 | 27.5 | +76% |
| 16 | 7.98 | 14.5 | +82% |
| 32 | 4.06 | 7.44 | +83% |
| 64 | 2.05 | 3.77 | +84% |
| 128 | 1.03 | 1.90 | +84% |
| 256 | 0.522 | 0.951 | +82% |
| 512 | 0.259 | 0.476 | +84% |
| 1024 | 0.130 | 0.239 | +83% |



### Run №3

* Intel HD Graphics 4000 + ANGLE(Direct3D11)
* Resolution 1368x768 (1368x768)
* Jan 1, 2024

| Renderings | A fps | B fps | Gain |
| :-: | :-: | :-: | :-: |
| 1 | 36.8 | 35.0 | -5% |
| 2 | 27.2 | 31.8 | +17% |
| 4 | 17.1 | 25.0 | +46% |
| 8 | 11.0 | 18.5 | +68% |
| 16 | 6.22 | 12.9 | +108% |
| 32 | 3.35 | 6.69 | +100% |
| 64 | 1.71 | 3.46 | +102% |
| 128 | 0.868 | 1.76 | +103% |
| 256 | 0.437 | 0.894 | +105% |
| 512 | 0.219 | 0.450 | +106% |
| 1024 | 0.110 | 0.226 | +106% |
