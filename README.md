# `Shopping-app`
Mern stack shopping-app

## `LandingPage.js`
![ezgif com-video-to-gif](https://user-images.githubusercontent.com/45006553/82416633-51c75f00-9ab5-11ea-9b0d-4578b9f2848b.gif)


### `Components`: 
- `CheckBox`(Continents) 
- `RadioBox`(Price) 
- `SearchFeature` 
- `Data(In Boxes)` 
- `ImageSlider`: `Carousel`
  
## `DetailPage.js && CartPage.js` 
![ezgif com-video-to-gif (1)](https://user-images.githubusercontent.com/45006553/82417410-7b34ba80-9ab6-11ea-9cb4-7db733ba3e2c.gif)

### `Components`: 
### `DetailPage`
- `DetailProduct` : 자세한 상품 정보 페이지
- `ProductInfo` : 상품 관련 정보
- `ProductImage` : 상품 이미지 관련
##### `npm`: `react-image-gallery`

### `CartPage`
- `UserCardBlock` : 상품 리스트 간단한 표로 구성
- `Paypal` : 상품 결제 관련 npm 


## `Paypal.js && HistoryPage.js` 
![ezgif com-video-to-gif](https://user-images.githubusercontent.com/45006553/82418084-7e7c7600-9ab7-11ea-9fcc-0c4aa5f1ee64.gif)

- `Paypal` : 테스트용 Paypal 계정 생성
- `History` : 상품 구매 내역
##### `npm` : `react-paypal-express-checkout`


## `UploadProductPage.js` 
![ezgif com-video-to-gif (2)](https://user-images.githubusercontent.com/45006553/82418654-390c7880-9ab8-11ea-971a-97cd27dcc794.gif)

##### `npm` : `Dropzone`


## `Server Part(MongoDB cluster)` 
![ezgif com-video-to-gif (3)](https://user-images.githubusercontent.com/45006553/82419745-c3091100-9ab9-11ea-9ae7-9dda8f875e1d.gif)

#### 3개 모델 생성
- `User` : 이용자 정보, 장바구니 내역, 구매내역 이력
- `Products` : 상품관련 정보
- `Payment` : 구매정보(구매자 정보, paypal 정보, 상품 정보)
