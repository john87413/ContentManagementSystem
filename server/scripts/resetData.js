// server/scripts/resetEnhancedData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// 載入環境變數
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 載入模型
const Category = require('../models/categoryModel');
const Ingredient = require('../models/ingredientModel');
const Drink = require('../models/drinkModel');
const Shop = require('../models/shopModel');
const Article = require('../models/articleModel');
const Carousel = require('../models/carouselModel');

// 連接數據庫
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 90000,
    socketTimeoutMS: 60000, 
    connectTimeoutMS: 60000,
    heartbeatFrequencyMS: 30000,
    retryWrites: true,
    w: 'majority'
})
    .then(() => { 
        console.log('MongoDB 連接成功') 
        resetData();
    })
    .catch(err => {
        console.error('MongoDB 連接失敗:', err);
        process.exit(1);
    });

// 重置數據函數
const resetData = async () => {
    try {
        console.log('開始刪除原有數據...');

        // 刪除所有集合中的數據，但保留用戶數據
        await Promise.all([
            Category.deleteMany({}),
            Ingredient.deleteMany({}),
            Drink.deleteMany({}),
            Shop.deleteMany({}),
            Article.deleteMany({}),
            Carousel.deleteMany({})
        ]);

        console.log('所有數據已刪除，開始創建示例數據...');

        //=========================================================
        // 創建分類數據 - 更多台灣特色分類
        //=========================================================
        console.log('創建分類數據...');
        const categories = await Category.insertMany([
            { name: '台灣特色茶品' },     // 青茶、烏龍茶等台灣特色茶
            { name: '經典奶茶系列' },     // 各種奶茶
            { name: '手沖咖啡' },         // 精品咖啡
            { name: '義式咖啡' },         // 拿鐵、卡布奇諾等
            { name: '新鮮果茶' },         // 水果茶
            { name: '冰沙系列' },         // 冰沙和冰磚
            { name: '季節限定' },         // 限時飲品
            { name: '養生飲品' },         // 養生茶品
            { name: '創意特調' },         // 創新口味
            { name: '霜淇淋系列' }        // 霜淇淋飲料
        ]);
        
        // 建立子分類
        const subCategories = await Category.insertMany([
            { name: '綠茶系列', parent: categories[0]._id },
            { name: '烏龍茶系列', parent: categories[0]._id },
            { name: '紅茶系列', parent: categories[0]._id },
            { name: '冬季限定', parent: categories[6]._id },
            { name: '夏季限定', parent: categories[6]._id }
        ]);
        
        // 合併所有分類到一個數組，便於引用
        const allCategories = [...categories, ...subCategories];
        
        // 獲取指定分類的ID的輔助函數
        const getCategoryId = (name) => {
            const category = allCategories.find(c => c.name === name);
            return category ? category._id : null;
        };

        console.log('分類數據創建完成');

        //=========================================================
        // 創建配料數據 - 更豐富的台灣飲料配料
        //=========================================================
        console.log('創建配料數據...');
        const ingredients = await Ingredient.insertMany([
            { name: '珍珠', price: 10 },
            { name: '波霸', price: 10 },
            { name: '小珍珠', price: 10 },
            { name: '椰果', price: 10 },
            { name: '粉條', price: 10 },
            { name: '芋圓', price: 15 },
            { name: '地瓜圓', price: 15 },
            { name: '仙草', price: 10 },
            { name: '愛玉', price: 15 },
            { name: '布丁', price: 15 },
            { name: '奶蓋', price: 20 },
            { name: '奶霜', price: 20 },
            { name: '白玉', price: 15 },
            { name: '蘆薈', price: 15 },
            { name: '寒天', price: 15 },
            { name: '水晶球', price: 15 },
            { name: '西米露', price: 15 },
            { name: '薑汁', price: 10 },
            { name: '蜂蜜', price: 10 },
            { name: '黑糖', price: 10 },
            { name: '鮮奶', price: 15 },
            { name: '豆漿', price: 15 },
            { name: '燕麥奶', price: 15 }
        ]);

        console.log('配料數據創建完成');

        //=========================================================
        // 創建門市數據 - 台灣各地分店資訊
        //=========================================================
        console.log('創建門市數據...');
        const shops = await Shop.insertMany([
            // 台北市
            {
                name: '台北信義旗艦店',
                phone: '0227001234',
                city: '臺北市',
                district: '信義區',
                address: '松仁路68號1樓'
            },
            {
                name: '台北東區店',
                phone: '0227681234',
                city: '臺北市',
                district: '大安區',
                address: '忠孝東路四段216號'
            },
            {
                name: '西門町店',
                phone: '0223751234',
                city: '臺北市',
                district: '萬華區',
                address: '成都路52號'
            },
            {
                name: '台北車站店',
                phone: '0223711234',
                city: '臺北市',
                district: '中正區',
                address: '忠孝西路一段49號B1'
            },
            {
                name: '台北公館店',
                phone: '0223631234',
                city: '臺北市',
                district: '中正區',
                address: '羅斯福路四段78號'
            },
            // 新北市
            {
                name: '板橋車站店',
                phone: '0229511234',
                city: '新北市',
                district: '板橋區',
                address: '站前路28號'
            },
            {
                name: '新莊中正店',
                phone: '0229761234',
                city: '新北市',
                district: '新莊區',
                address: '中正路243號'
            },
            {
                name: '三峽北大店',
                phone: '0226681234',
                city: '新北市',
                district: '三峽區',
                address: '大學路151號'
            },
            // 桃園市
            {
                name: '桃園站前店',
                phone: '0332811234',
                city: '桃園市',
                district: '桃園區',
                address: '復興路99號'
            },
            {
                name: '中壢中原店',
                phone: '0332811234',
                city: '桃園市',
                district: '中壢區',
                address: '中北路75號'
            },
            // 台中市
            {
                name: '台中三民店',
                phone: '0422231234',
                city: '臺中市',
                district: '北區',
                address: '三民路三段161號'
            },
            {
                name: '台中逢甲店',
                phone: '0427071234',
                city: '臺中市',
                district: '西屯區',
                address: '文華路127號'
            },
            // 台南市
            {
                name: '台南東寧店',
                phone: '0622001234',
                city: '臺南市',
                district: '東區',
                address: '東寧路289號'
            },
            // 高雄市
            {
                name: '高雄瑞豐夜市店',
                phone: '0733001234',
                city: '高雄市',
                district: '左營區',
                address: '裕誠路301號'
            },
            {
                name: '高雄夢時代店',
                phone: '0733501234',
                city: '高雄市',
                district: '前鎮區',
                address: '時代大道999號2F'
            }
        ]);

        console.log('門市數據創建完成');

        //=========================================================
        // 創建文章數據 - 更豐富的台灣茶飲文章內容
        //=========================================================
        console.log('創建文章數據...');
        const articles = await Article.insertMany([
            {
                title: '台灣手搖飲的歷史：從路邊攤到國際化品牌',
                category: getCategoryId('台灣特色茶品'),
                content: `<h2>台灣手搖飲的發展歷程</h2>
                <p>台灣的手搖飲料文化可追溯到1980年代，從最初的路邊攤發展至今已成為台灣文化象徵。</p>
                <h3>初期發展：珍珠奶茶的誕生</h3>
                <p>1980年代末，台中春水堂首創珍珠奶茶，將粉圓與奶茶結合，開創了全新的飲品類別。這項創新迅速風靡全台，成為台灣飲料文化的轉捩點。</p>
                <h3>成長與國際化</h3>
                <p>2000年代起，台灣手搖飲開始國際化發展，並吸引外國遊客專程來台品嚐。各大品牌如：</p>
                <ul>
                    <li>50嵐</li>
                    <li>清心福全</li>
                    <li>CoCo都可</li>
                    <li>迷客夏</li>
                    <li>珍煮丹</li>
                    <li>貢茶</li>
                </ul>
                <p>這些品牌已陸續進軍亞洲、北美、歐洲等市場，將台灣飲品文化推向國際舞台。</p>
                <h3>創新與未來</h3>
                <p>近年來，手搖飲持續創新，融入水果、奶蓋、黑糖等元素，並注重健康、環保理念，發展出更多元化的產品。台灣手搖飲已從單純的飲料成為一種生活態度與文化符號。</p>`,
                image: {
                    fileName: 'taiwan_bubble_tea_history.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/bubbletea?lock=20'
                }
            },
            {
                title: '台灣特色茶葉完全指南：從產地到沖泡',
                category: getCategoryId('台灣特色茶品'),
                content: `<h2>台灣茶葉的獨特之處</h2>
                <p>台灣以其優質茶葉聞名於世，從高山烏龍到蜜香紅茶，每一種都承載著台灣獨特的風土特色。</p>
                <h3>台灣主要茶區</h3>
                <p>台灣主要茶區分布：</p>
                <ul>
                    <li><strong>北部</strong>：文山包種茶、坪林茶區</li>
                    <li><strong>中部</strong>：杉林溪高山茶、梨山茶區</li>
                    <li><strong>東部</strong>：花蓮紅玉紅茶</li>
                    <li><strong>南部</strong>：阿里山高山茶</li>
                </ul>
                <h3>台灣特色茶種</h3>
                <h4>高山烏龍茶</h4>
                <p>生長於海拔1000公尺以上的茶園，茶湯清香甘醇，喉韻佳。代表產區：梨山、阿里山、杉林溪。</p>
                <h4>東方美人茶</h4>
                <p>又稱膨風茶，特色是被小綠葉蟬啃咬後產生的蜜香，滋味甘醇，帶有天然蜂蜜香。</p>
                <h4>文山包種茶</h4>
                <p>輕發酵青茶，清香幽雅，滋味甘醇，是台灣最早外銷的茶種。</p>
                <h4>紅玉紅茶</h4>
                <p>台茶18號，具有肉桂、薄荷般的清涼感，是台灣特有的紅茶品種。</p>
                <h3>正確沖泡方法</h3>
                <p>不同茶種適合的沖泡溫度和時間：</p>
                <ul>
                    <li>高山烏龍：95°C，悶泡45秒</li>
                    <li>東方美人：90°C，悶泡60秒</li>
                    <li>包種茶：85°C，悶泡30秒</li>
                    <li>紅玉紅茶：95°C，悶泡30秒</li>
                </ul>
                <p>選購時注意製造日期、香氣、茶湯顏色和口感，以獲得最佳品質。</p>`,
                image: {
                    fileName: 'taiwan_tea_guide.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/oolongtea?lock=21'
                }
            },
            {
                title: '手搖飲品的健康選擇：減糖、少冰怎麼點最好？',
                category: getCategoryId('養生飲品'),
                content: `<h2>聰明點飲料，健康喝手搖</h2>
                <p>手搖飲料雖然美味，但過量飲用可能對健康造成負擔。透過正確的點餐方式，可以兼顧口感與健康。</p>
                <h3>糖度選擇指南</h3>
                <p>手搖飲的糖度通常分為：</p>
                <ul>
                    <li><strong>全糖</strong>：約為一般含糖飲料的100%糖度</li>
                    <li><strong>七分糖</strong>：約為全糖的70%</li>
                    <li><strong>半糖</strong>：約為全糖的50%</li>
                    <li><strong>三分糖</strong>：約為全糖的30%</li>
                    <li><strong>微糖</strong>：約為全糖的10%</li>
                    <li><strong>無糖</strong>：不額外添加糖</li>
                </ul>
                <p>健康建議：選擇微糖或無糖，若覺得口感不足，可搭配有天然甜味的配料，如椰果、芋圓等。</p>
                <h3>冰塊選擇與健康</h3>
                <p>冰塊選擇影響飲品濃度和口感：</p>
                <ul>
                    <li><strong>正常冰</strong>：口感最佳，但容易稀釋</li>
                    <li><strong>少冰</strong>：維持較長時間的風味</li>
                    <li><strong>微冰</strong>：適合胃寒體質者</li>
                    <li><strong>去冰</strong>：最不影響原味，適合冬季或怕冰的人</li>
                </ul>
                <h3>健康取向的飲品推薦</h3>
                <p>較健康的手搖飲選擇：</p>
                <ul>
                    <li>無糖綠茶、烏龍茶：富含抗氧化物</li>
                    <li>新鮮水果茶：補充維生素，但注意糖度</li>
                    <li>無糖豆漿：優質植物蛋白來源</li>
                    <li>薑茶：溫胃暖身，適合冬季飲用</li>
                </ul>
                <h3>注意事項</h3>
                <p>即使選擇健康的手搖飲，也應注意飲用頻率。建議：</p>
                <ul>
                    <li>每週不超過2-3次</li>
                    <li>避免空腹飲用含乳製品的飲料</li>
                    <li>多選擇新鮮原料製作的飲品</li>
                </ul>
                <p>透過聰明點餐，手搖飲也能成為健康生活的一部分。</p>`,
                image: {
                    fileName: 'healthy_drink_choices.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/healthydrink?lock=22'
                }
            },
            {
                title: '季節限定！芒果系列飲品全新上市',
                category: getCategoryId('季節限定'),
                content: `<h2>夏季最佳良伴：芒果系列飲品</h2>
                <p>炎炎夏日，我們特別推出多款以台灣在地芒果為主角的限定飲品，帶給您最清爽的消暑體驗。</p>
                <h3>嚴選台灣優質芒果</h3>
                <p>本次系列使用的芒果全部來自台南玉井、屏東枋山等知名產區的優質愛文芒果，以確保最佳風味。每一顆芒果都經過嚴格篩選，保證新鮮、香甜多汁。</p>
                <h3>芒果系列新品介紹</h3>
                <ul>
                    <li><strong>芒果綠茶凍飲</strong>：新鮮芒果搭配清爽綠茶，加入手工綠茶凍，層次豐富。</li>
                    <li><strong>芒果波波鮮奶</strong>：香甜芒果醬與濃郁鮮奶完美結合，搭配QQ黑糖波波，口感細膩豐富。</li>
                    <li><strong>雙重芒果冰沙</strong>：兩種不同品種芒果混合打製，帶來多層次風味，酸甜適中，冰涼消暑。</li>
                    <li><strong>芒果蜂蜜冰茶</strong>：輕發酵烏龍茶為基底，搭配芒果果肉與純淨蜂蜜，健康無負擔。</li>
                </ul>
                <h3>限時優惠活動</h3>
                <p>6月1日至8月31日期間，購買任一芒果系列飲品，即可獲得集點貼紙一枚，集滿5枚可兌換限量版環保吸管套組。</p>
                <h3>營養小知識</h3>
                <p>芒果富含維生素A、C和膳食纖維，適量食用有助於增強免疫力、改善視力和促進消化。</p>
                <p>歡迎大家到各門市品嚐這季最鮮甜的芒果好滋味！</p>`,
                image: {
                    fileName: 'mango_drinks.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/mangodrink?lock=23'
                }
            },
            {
                title: '手工黑糖珍珠的製作秘訣大公開',
                category: getCategoryId('經典奶茶系列'),
                content: `<h2>老師傅的黑糖珍珠製作心法</h2>
                <p>完美的珍珠奶茶，關鍵在於那一顆顆Q彈有勁的黑糖珍珠。今天特別邀請到本店資深師傅，分享獨家製作秘訣。</p>
                <h3>優質原料的選擇</h3>
                <p>好的珍珠需要優質的原料：</p>
                <ul>
                    <li><strong>樹薯粉</strong>：選用台灣中南部栽種的高品質樹薯製成的粉，彈性佳</li>
                    <li><strong>黑糖</strong>：使用沖繩或台灣產的純正黑糖，風味濃郁不死甜</li>
                    <li><strong>二砂糖</strong>：增添珍珠口感的關鍵</li>
                    <li><strong>純淨水</strong>：影響珍珠口感的隱形要素</li>
                </ul>
                <h3>黑糖珍珠製作步驟</h3>
                <ol>
                    <li><strong>備料</strong>：樹薯粉250g、黑糖粉30g、二砂糖20g、熱水160ml</li>
                    <li><strong>調製糖水</strong>：將黑糖粉和二砂糖加入熱水中，攪拌至完全溶解</li>
                    <li><strong>揉製麵團</strong>：將糖水慢慢加入樹薯粉中，邊加邊揉，直到形成有彈性的麵團</li>
                    <li><strong>搓珍珠</strong>：將麵團搓成長條狀，再切成小塊，用手掌搓成圓形顆粒</li>
                    <li><strong>篩粉</strong>：搓好的生珍珠灑上少許樹薯粉防黏</li>
                    <li><strong>煮製</strong>：將珍珠放入滾水中，大火煮約15-20分鐘，直到中心透明</li>
                    <li><strong>冰鎮</strong>：煮好後立即撈起，放入冰水中浸泡10秒鐘停止熟成過程</li>
                    <li><strong>糖漬</strong>：瀝乾後浸泡在特製黑糖漿中，至少30分鐘</li>
                </ol>
                <h3>完美珍珠的標準</h3>
                <p>優質黑糖珍珠應該：</p>
                <ul>
                    <li>外觀油亮光滑，顏色均勻</li>
                    <li>口感Q彈有嚼勁，但不過硬</li>
                    <li>入口即有黑糖香氣，甜而不膩</li>
                    <li>中心透明無白芯</li>
                </ul>
                <h3>保存小技巧</h3>
                <p>製作好的珍珠最佳賞味期為4小時內，若需保存，可放入黑糖漿中，冷藏不超過24小時。食用前以溫水稍微加熱即可恢復彈性。</p>
                <p>嘗試這些專業技巧，在家也能製作出店家等級的完美珍珠！</p>`,
                image: {
                    fileName: 'handmade_pearls.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/tapiocapearls?lock=24'
                }
            },
            {
                title: '咖啡知識：單品咖啡的風味輪廓解析',
                category: getCategoryId('手沖咖啡'),
                content: `<h2>探索單品咖啡的奧妙</h2>
                <p>與綜合咖啡不同，單品咖啡保留了特定產區、特定品種的獨特風味，讓咖啡愛好者能夠品嚐到最純粹的味道。</p>
                <h3>什麼是單品咖啡？</h3>
                <p>單品咖啡是指來自單一產區、單一莊園甚至單一地塊的咖啡豆，未與其他產地或品種的咖啡豆混合。這使得每一款單品咖啡都展現出獨特的風土特色。</p>
                <h3>產區與風味的關係</h3>
                <h4>衣索比亞</h4>
                <p>被視為咖啡的發源地，以明亮的酸度和花香聞名。代表產區：</p>
                <ul>
                    <li><strong>耶加雪菲</strong>：帶有茉莉花香、柑橘和藍莓風味</li>
                    <li><strong>西達摩</strong>：柑橘、花香中帶有蜂蜜甜感</li>
                    <li><strong>古吉</strong>：明亮酸質，帶有漿果和柑橘風味</li>
                </ul>
                <h4>哥倫比亞</h4>
                <p>平衡且風味豐富的咖啡，酸度適中：</p>
                <ul>
                    <li><strong>娜玲瓏</strong>：焦糖甜感，柑橘酸度與堅果香</li>
                    <li><strong>黑鹿區</strong>：巧克力風味，溫和的果酸</li>
                </ul>
                <h4>瓜地馬拉</h4>
                <p>以巧克力風味和焦糖甜感著稱：</p>
                <ul>
                    <li><strong>安提瓜</strong>：濃郁的巧克力味，中等酸度，帶有焦糖甜感</li>
                    <li><strong>韋伯特南果</strong>：花香、柑橘與太妃糖風味</li>
                </ul>
                <h3>沖煮方法的影響</h3>
                <p>不同沖煮法能帶出單品咖啡不同的風味特色：</p>
                <ul>
                    <li><strong>手沖</strong>：能夠完整呈現咖啡的層次感和風味細節</li>
                    <li><strong>虹吸壺</strong>：帶出咖啡的清透感和細膩口感</li>
                    <li><strong>愛樂壓</strong>：強調咖啡的醇厚感和濃郁風味</li>
                    <li><strong>義式濃縮</strong>：突顯咖啡的濃郁和油脂感</li>
                </ul>
                <h3>如何品鑑單品咖啡</h3>
                <p>完整的品鑑流程包括：</p>
                <ol>
                    <li><strong>聞香</strong>：分為乾聞和濕聞，觀察咖啡的香氣特點</li>
                    <li><strong>啜飲</strong>：輕輕吸入咖啡，讓液體覆蓋整個味蕾</li>
                    <li><strong>觀察</strong>：注意咖啡的酸度、甜度、醇厚度、餘韻等</li>
                    <li><strong>描述</strong>：使用標準風味輪來描述您的感受</li>
                </ol>
                <p>在我們的門市，您可以品嚐來自世界各地精選的單品咖啡，由專業咖啡師為您手沖，體驗不同產區的獨特風味。</p>`,
                image: {
                    fileName: 'single_origin_coffee.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/coffee?lock=25'
                }
            },
            {
                title: '冬季限定：薑汁黑糖暖心飲品系列上市',
                category: getCategoryId('冬季限定'),
                content: `<h2>暖心暖胃的冬季專屬</h2>
                <p>隨著氣溫下降，我們特別推出結合傳統台灣元素的薑汁黑糖系列飲品，溫暖您的每一天。</p>
                <h3>台灣老薑與黑糖的完美結合</h3>
                <p>本次限定系列使用台灣南投埔里特產的老薑，以及屏東產的傳統手工黑糖，透過特殊熬製工藝，完美保留薑的辛香與黑糖的甜潤。</p>
                <h3>限定飲品系列介紹</h3>
                <ul>
                    <li><strong>薑汁黑糖奶茶</strong>：採用阿薩姆紅茶為基底，加入薑汁黑糖與香濃鮮奶，香氣四溢，溫潤順口。</li>
                    <li><strong>黑糖薑茶拿鐵</strong>：以黑糖薑茶搭配鮮奶打製而成，濃郁中帶有薑的清香，暖胃又暖心。</li>
                    <li><strong>薑汁黑糖珍珠鮮奶</strong>：Q彈珍珠浸泡在特製薑汁黑糖中，與鮮奶調和，層次豐富，口感滑順。</li>
                    <li><strong>薑汁奶皇厚奶</strong>：以黑糖薑汁為底，加入特製奶皇與雙倍鮮奶，濃厚不膩口，是冬日的極致享受。</li>
                </ul>
                <h3>薑的健康功效</h3>
                <p>薑不僅味道香辛，更具有多種健康功效：</p>
                <ul>
                    <li>促進血液循環，幫助身體保暖</li>
                    <li>緩解喉嚨不適和咳嗽症狀</li>
                    <li>幫助消化，減輕胃部不適</li>
                    <li>提振精神，緩解疲勞感</li>
                </ul>
                <h3>限時活動</h3>
                <p>即日起至2月底，凡購買薑汁黑糖系列飲品，出示會員卡即可享有第二杯半價優惠。每週一至週四下午3點至5點，還有買一送一特別時段！</p>
                <p>趕快到全台門市，嚐嚐這個冬季最溫暖的味道！</p>`,
                image: {
                    fileName: 'ginger_brown_sugar.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/gingertea?lock=26'
                }
            },
            {
                title: '喝對了嗎？四季烏龍、高山茶、東方美人大不同',
                category: getCategoryId('台灣特色茶品'),
                content: `<h2>認識台灣特色茶種</h2>
                <p>台灣的茶文化深厚，各式茶種各有特色，本文將帶您一探台灣特色茶品的奧秘。</p>
                <h3>台灣烏龍茶家族</h3>
                <h4>四季春</h4>
                <p>特色：</p>
                <ul>
                    <li>清香型烏龍茶，帶有淡雅的花香</li>
                    <li>茶湯呈現淡黃色，清爽不苦澀</li>
                    <li>適合各季節飲用，尤其適合初接觸烏龍茶的人</li>
                </ul>
                <h4>凍頂烏龍</h4>
                <p>特色：</p>
                <ul>
                    <li>產於南投縣鹿谷鄉凍頂山</li>
                    <li>具有獨特的蜜香和果香</li>
                    <li>茶湯呈現金黃色，滋味甘醇滑順</li>
                </ul>
                <h4>高山茶</h4>
                <p>特色：</p>
                <ul>
                    <li>生長於海拔1,000公尺以上的茶園</li>
                    <li>因高海拔、低溫、雲霧環繞的生長環境，葉片厚實，內含物質豐富</li>
                    <li>香氣清新高揚，回甘明顯，滋味甘醇</li>
                    <li>代表產區：梨山、阿里山、杉林溪、大禹嶺</li>
                </ul>
                <h3>台灣特色茶種</h3>
                <h4>東方美人茶（椪風茶）</h4>
                <p>特色：</p>
                <ul>
                    <li>最大特點是經小綠葉蟬啃咬後產生的蜜香</li>
                    <li>外觀白毫顯露，色澤金黃</li>
                    <li>滋味甘甜，有明顯蜂蜜香和果香</li>
                    <li>主要產於新竹縣北埔、峨眉一帶</li>
                </ul>
                <h4>台灣紅茶</h4>
                <p>特色：</p>
                <ul>
                    <li>日治時期發展，近年復興</li>
                    <li>代表品種：紅玉（台茶18號）、台茶21號</li>
                    <li>紅玉帶有天然肉桂和薄荷香氣，滋味濃郁</li>
                    <li>主要產區：南投魚池、花蓮瑞穗</li>
                </ul>
                <h3>沖泡建議</h3>
                <p>各類茶品的最佳沖泡方式：</p>
                <table>
                    <tr>
                        <th>茶種</th>
                        <th>水溫</th>
                        <th>沖泡時間</th>
                        <th>適合茶具</th>
                    </tr>
                    <tr>
                        <td>四季春</td>
                        <td>90-95°C</td>
                        <td>30-45秒</td>
                        <td>蓋碗、小壺</td>
                    </tr>
                    <tr>
                        <td>高山烏龍</td>
                        <td>95°C</td>
                        <td>45-60秒</td>
                        <td>蓋碗、小壺</td>
                    </tr>
                    <tr>
                        <td>東方美人</td>
                        <td>85-90°C</td>
                        <td>60秒</td>
                        <td>玻璃杯、蓋碗</td>
                    </tr>
                    <tr>
                        <td>紅玉紅茶</td>
                        <td>95-100°C</td>
                        <td>30-60秒</td>
                        <td>玻璃杯、紫砂壺</td>
                    </tr>
                </table>
                <p>透過正確的沖泡方式，能充分體會台灣茶的細緻風味。歡迎到我們的門市，品嚐各式正統台灣茶。</p>`,
                image: {
                    fileName: 'taiwan_tea_varieties.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/taiwantea?lock=27'
                }
            },
            {
                title: '夏日消暑特輯：創意水果茶DIY',
                category: getCategoryId('新鮮果茶'),
                content: `<h2>在家也能製作專業水果茶</h2>
                <p>炎炎夏日，沒有什麼比一杯清爽的水果茶更適合消暑了。今天分享幾款簡單又美味的水果茶食譜，讓您在家也能享受專業級的清涼飲品。</p>
                <h3>基本水果茶原則</h3>
                <p>製作完美水果茶的幾個關鍵因素：</p>
                <ul>
                    <li>選用新鮮當季水果，風味最佳</li>
                    <li>茶底選擇要與水果相配，不宜太濃郁</li>
                    <li>糖分適量，讓水果的天然甜度為主角</li>
                    <li>水果切塊大小適中，方便入口也利於釋放風味</li>
                </ul>
                <h3>創意水果茶配方</h3>
                <h4>1. 蜜香紅茶鮮果飲</h4>
                <p>材料：</p>
                <ul>
                    <li>蜜香紅茶包 1-2包</li>
                    <li>蘋果 1/4顆，切小塊</li>
                    <li>橙子 1/4顆，切小塊</li>
                    <li>奇異果 1/2顆，切片</li>
                    <li>草莓 3-4顆，切半</li>
                    <li>蜂蜜 適量</li>
                    <li>冰塊 適量</li>
                </ul>
                <p>做法：</p>
                <ol>
                    <li>將紅茶包以90°C熱水沖泡3分鐘，取出茶包</li>
                    <li>加入適量蜂蜜調味，攪拌均勻</li>
                    <li>放涼後冷藏至冰涼</li>
                    <li>在杯中放入切好的水果</li>
                    <li>倒入冰涼紅茶，加入冰塊即可</li>
                </ol>
                <h4>2. 檸檬百香果綠茶</h4>
                <p>材料：</p>
                <ul>
                    <li>綠茶包 1-2包</li>
                    <li>檸檬 1/2顆，切片</li>
                    <li>百香果 2顆，取籽</li>
                    <li>蜂蜜或糖漿 適量</li>
                    <li>薄荷葉 少許</li>
                    <li>冰塊 適量</li>
                </ul>
                <p>做法：</p>
                <ol>
                    <li>綠茶以85°C熱水沖泡2分鐘，取出茶包</li>
                    <li>加入蜂蜜或糖漿調味</li>
                    <li>放涼後冷藏</li>
                    <li>杯中放入檸檬片、百香果籽和薄荷葉</li>
                    <li>用調酒匙輕壓檸檬和百香果，釋放香氣</li>
                    <li>倒入冰綠茶，加入冰塊即可</li>
                </ol>
                <h4>3. 蜜桃烏龍冰茶</h4>
                <p>材料：</p>
                <ul>
                    <li>清香型烏龍茶 3克</li>
                    <li>水蜜桃 1顆，去核切塊</li>
                    <li>蜂蜜 適量</li>
                    <li>檸檬汁 1茶匙</li>
                    <li>冰塊 適量</li>
                </ul>
                <p>做法：</p>
                <ol>
                    <li>烏龍茶以90°C熱水沖泡，浸泡45秒後倒出</li>
                    <li>再次加水沖泡1分鐘，取出茶葉</li>
                    <li>加入蜂蜜和檸檬汁調味</li>
                    <li>放涼後冷藏</li>
                    <li>杯中放入蜜桃塊和冰塊</li>
                    <li>倒入冰烏龍茶即可</li>
                </ol>
                <h3>水果茶擺盤技巧</h3>
                <p>想讓自製水果茶更加吸引人，可以：</p>
                <ul>
                    <li>使用透明玻璃杯，展示豐富色彩</li>
                    <li>水果切片靠杯壁排列，視覺效果更佳</li>
                    <li>搭配薄荷葉、迷迭香等香草點綴</li>
                    <li>可用一片柑橘類水果掛在杯緣作為裝飾</li>
                </ul>
                <p>動手試試這些簡單又美味的水果茶配方，為您的夏日增添一抹清涼與色彩！</p>`,
                image: {
                    fileName: 'diy_fruit_tea.jpg',
                    imgUrl: 'https://loremflickr.com/640/480/fruittea?lock=28'
                }
            }
        ]);

        console.log('文章數據創建完成');

        //=========================================================
        // 創建輪播圖數據 - 更豐富的輪播內容
        //=========================================================
        console.log('創建輪播圖數據...');
        await Carousel.insertMany([
            {
                name: '台灣特色茶品輪播',
                articles: [
                    { article: articles[0]._id }, // 台灣手搖飲的歷史
                    { article: articles[1]._id }, // 台灣特色茶葉完全指南
                    { article: articles[6]._id }  // 喝對了嗎？四季烏龍
                ]
            },
            {
                name: '季節限定輪播',
                articles: [
                    { article: articles[3]._id }, // 芒果系列飲品
                    { article: articles[5]._id }, // 冬季限定薑汁系列
                ]
            },
            {
                name: '健康養生輪播',
                articles: [
                    { article: articles[2]._id }, // 手搖飲品的健康選擇
                    { article: articles[7]._id }, // 夏日消暑特輯
                ]
            },
            {
                name: '製作技巧輪播',
                articles: [
                    { article: articles[4]._id }, // 手工黑糖珍珠的製作秘訣
                ]
            }
        ]);

        console.log('輪播圖數據創建完成');

        //=========================================================
        // 創建飲品數據 - 豐富多樣的台灣特色飲品
        //=========================================================
        console.log('創建飲品數據...');
        await Drink.insertMany([
            // 台灣特色茶品
            {
                name: '阿里山高山烏龍茶',
                price: 65,
                category: getCategoryId('台灣特色茶品'),
                images: [
                    {
                        fileName: 'alishan_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/oolongtea?lock=30'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 5,
                scores: {
                    wom: 4.8,
                    store: 4.9
                },
                introduction: '使用產自阿里山高海拔茶園的優質烏龍茶葉，清香回甘，喉韻佳。',
                alert: '孕婦與對咖啡因敏感者請斟酌飲用'
            },
            {
                name: '蜜香紅茶',
                price: 55,
                category: getCategoryId('台灣特色茶品'),
                images: [
                    {
                        fileName: 'honey_black_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/blacktea?lock=31'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 10,
                scores: {
                    wom: 4.6,
                    store: 4.7
                },
                introduction: '採用台灣台茶18號紅玉紅茶，具有天然肉桂香與微微薄荷香，滋味濃醇。',
                alert: '孕婦與對咖啡因敏感者請斟酌飲用'
            },
            {
                name: '文山包種茶',
                price: 60,
                category: getCategoryId('台灣特色茶品'),
                images: [
                    {
                        fileName: 'wenshan_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/greentea?lock=32'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 5,
                scores: {
                    wom: 4.5,
                    store: 4.6
                },
                introduction: '選用台北文山區的特色包種茶，帶有淡雅的花香與清爽的茶韻。',
                alert: '無特殊注意事項'
            },
            
            // 經典奶茶系列
            {
                name: '珍珠鮮奶茶',
                price: 75,
                category: getCategoryId('經典奶茶系列'),
                images: [
                    {
                        fileName: 'pearl_milk_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/bubbletea?lock=33'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 350,
                scores: {
                    wom: 4.9,
                    store: 5.0
                },
                introduction: '使用特選阿薩姆紅茶與100%鮮奶，搭配手工製作黑糖珍珠，香濃滑順。',
                alert: '內含乳製品，乳糖不耐者請斟酌飲用'
            },
            {
                name: '黑糖鮮奶',
                price: 80,
                category: getCategoryId('經典奶茶系列'),
                images: [
                    {
                        fileName: 'brown_sugar_milk.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/brownsugar?lock=34'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 320,
                scores: {
                    wom: 4.7,
                    store: 4.8
                },
                introduction: '嚴選屏東手工黑糖熬製糖漿，與鮮奶完美結合，濃郁不膩。',
                alert: '內含乳製品，乳糖不耐者請斟酌飲用'
            },
            {
                name: '芋頭西米露鮮奶',
                price: 90,
                category: getCategoryId('經典奶茶系列'),
                images: [
                    {
                        fileName: 'taro_sago_milk.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/tarodrink?lock=35'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 380,
                scores: {
                    wom: 4.8,
                    store: 4.9
                },
                introduction: '使用台灣大甲芋頭熬製而成的芋泥，加入Q彈西米露與濃郁鮮奶，口感層次豐富。',
                alert: '內含乳製品，乳糖不耐者請斟酌飲用'
            },
            
            // 手沖咖啡
            {
                name: '單品手沖咖啡',
                price: 120,
                category: getCategoryId('手沖咖啡'),
                images: [
                    {
                        fileName: 'hand_drip_coffee.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/coffeedrip?lock=36'
                    }
                ],
                hotCold: '冷,熱',
                size: '中',
                selling: true,
                kal: 10,
                scores: {
                    wom: 4.9,
                    store: 4.8
                },
                introduction: '每日精選不同產區的頂級咖啡豆，由專業咖啡師手沖，展現最佳風味。',
                alert: '內含咖啡因，孕婦及兒童請避免飲用'
            },
            
            // 義式咖啡
            {
                name: '黑糖拿鐵',
                price: 95,
                category: getCategoryId('義式咖啡'),
                images: [
                    {
                        fileName: 'brown_sugar_latte.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/brownsugardrink?lock=37'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 250,
                scores: {
                    wom: 4.6,
                    store: 4.7
                },
                introduction: '濃郁義式濃縮咖啡搭配手工黑糖漿與鮮奶，甜而不膩，層次分明。',
                alert: '內含咖啡因和乳製品，孕婦及乳糖不耐者請斟酌飲用'
            },
            {
                name: '焦糖瑪奇朵',
                price: 105,
                category: getCategoryId('義式咖啡'),
                images: [
                    {
                        fileName: 'caramel_macchiato.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/macchiato?lock=38'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 280,
                scores: {
                    wom: 4.7,
                    store: 4.9
                },
                introduction: '香醇義式濃縮咖啡與蒸煮鮮奶，淋上特製焦糖醬，風味層次豐富。',
                alert: '內含咖啡因和乳製品，孕婦及乳糖不耐者請斟酌飲用'
            },
            
            // 新鮮果茶
            {
                name: '鮮榨檸檬青茶',
                price: 70,
                category: getCategoryId('新鮮果茶'),
                images: [
                    {
                        fileName: 'lemon_green_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/lemontea?lock=39'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 130,
                scores: {
                    wom: 4.5,
                    store: 4.6
                },
                introduction: '嚴選台灣四季春茶為基底，搭配現榨檸檬汁，清新酸甜，消暑解渴。',
                alert: '檸檬酸性較高，胃酸過多者請斟酌飲用'
            },
            {
                name: '芒果綠茶',
                price: 85,
                category: getCategoryId('新鮮果茶'),
                images: [
                    {
                        fileName: 'mango_green_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/mangotea?lock=40'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 180,
                scores: {
                    wom: 4.8,
                    store: 4.7
                },
                introduction: '使用台南玉井愛文芒果打成果泥，搭配清爽綠茶，香甜可口。',
                alert: '芒果屬於高敏食物，過敏體質請斟酌飲用'
            },
            {
                name: '百香果綠茶',
                price: 75,
                category: getCategoryId('新鮮果茶'),
                images: [
                    {
                        fileName: 'passion_fruit_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/passionfruit?lock=41'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 150,
                scores: {
                    wom: 4.6,
                    store: 4.8
                },
                introduction: '選用南投埔里的新鮮百香果，酸甜適中，搭配清爽綠茶，風味絕佳。',
                alert: '百香果性微寒，胃寒體質者請斟酌飲用'
            },
            
            // 冰沙系列
            {
                name: '草莓優格冰沙',
                price: 110,
                category: getCategoryId('冰沙系列'),
                images: [
                    {
                        fileName: 'strawberry_yogurt_smoothie.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/strawberrysmoothie?lock=42'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 280,
                scores: {
                    wom: 4.7,
                    store: 4.9
                },
                introduction: '使用當季新鮮草莓與優質優格調製而成，口感滑順，莓果香氣濃郁。',
                alert: '內含乳製品，乳糖不耐者請斟酌飲用'
            },
            {
                name: '芒果冰沙',
                price: 105,
                category: getCategoryId('冰沙系列'),
                images: [
                    {
                        fileName: 'mango_smoothie.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/mangosmoothie?lock=43'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 260,
                scores: {
                    wom: 4.9,
                    store: 4.8
                },
                introduction: '採用台南在地愛文芒果製成，濃郁的芒果香氣，口感綿密滑順。',
                alert: '芒果屬於高敏食物，過敏體質請斟酌飲用'
            },
            
            // 季節限定
            {
                name: '桂花烏龍茶',
                price: 75,
                category: getCategoryId('季節限定'),
                images: [
                    {
                        fileName: 'osmanthus_oolong.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/flowerdrink?lock=44'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 80,
                scores: {
                    wom: 4.7,
                    store: 4.8
                },
                introduction: '精選清香型烏龍茶，搭配天然桂花釀製而成，花香怡人，滋味甘醇。',
                alert: '無特殊注意事項'
            },
            {
                name: '薑汁奶皇厚奶',
                price: 115,
                category: getCategoryId('冬季限定'),
                images: [
                    {
                        fileName: 'ginger_milk.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/gingermilk?lock=45'
                    }
                ],
                hotCold: '熱',
                size: '中,大',
                selling: true,
                kal: 320,
                scores: {
                    wom: 4.8,
                    store: 4.9
                },
                introduction: '以手工薑汁黑糖為底，加入特製奶皇與雙倍鮮奶，濃厚不膩口，暖心暖胃。',
                alert: '內含乳製品，乳糖不耐者請斟酌飲用'
            },
            {
                name: '夏季水果茶',
                price: 90,
                category: getCategoryId('夏季限定'),
                images: [
                    {
                        fileName: 'summer_fruit_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/fruittea?lock=46'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 150,
                scores: {
                    wom: 4.6,
                    store: 4.7
                },
                introduction: '精選當季水果：蘋果、橙子、葡萄柚、奇異果，以蜜香紅茶為基底，清新爽口。',
                alert: '奇異果屬於高敏食物，過敏體質請斟酌飲用'
            },
            
            // 養生飲品
            {
                name: '蜂蜜菊花茶',
                price: 65,
                category: getCategoryId('養生飲品'),
                images: [
                    {
                        fileName: 'honey_chrysanthemum_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/chrysanthemum?lock=47'
                    }
                ],
                hotCold: '冷,熱',
                size: '中,大',
                selling: true,
                kal: 100,
                scores: {
                    wom: 4.5,
                    store: 4.6
                },
                introduction: '精選杭菊搭配天然龍眼蜜，具有清熱解毒、明目功效，適合長時間使用電腦的現代人。',
                alert: '菊花性偏寒，胃寒體質者請斟酌飲用'
            },
            {
                name: '紅棗桂圓茶',
                price: 70,
                category: getCategoryId('養生飲品'),
                images: [
                    {
                        fileName: 'date_longan_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/datekiongandrink?lock=48'
                    }
                ],
                hotCold: '熱',
                size: '中,大',
                selling: true,
                kal: 120,
                scores: {
                    wom: 4.6,
                    store: 4.7
                },
                introduction: '精選新疆大紅棗與台灣桂圓肉熬製，搭配清香烏龍茶，具有滋補養顏功效。',
                alert: '紅棗桂圓性溫，體質燥熱者請斟酌飲用'
            },
            
            // 創意特調
            {
                name: '奶蓋抹茶',
                price: 100,
                category: getCategoryId('創意特調'),
                images: [
                    {
                        fileName: 'cheese_foam_matcha.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/matchacheese?lock=49'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 310,
                scores: {
                    wom: 4.8,
                    store: 4.9
                },
                introduction: '頂級日本抹茶粉製成的抹茶，上層覆以香濃奶蓋，風味層次豐富。',
                alert: '內含乳製品，乳糖不耐者請斟酌飲用'
            },
            {
                name: '蜂蜜檸檬愛玉',
                price: 85,
                category: getCategoryId('創意特調'),
                images: [
                    {
                        fileName: 'honey_lemon_aiyu.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/lemonjelly?lock=50'
                    }
                ],
                hotCold: '冷',
                size: '中,大',
                selling: true,
                kal: 150,
                scores: {
                    wom: 4.7,
                    store: 4.8
                },
                introduction: '手工製作台灣傳統愛玉凍，搭配現榨檸檬汁與天然蜂蜜，酸甜滑嫩。',
                alert: '檸檬酸性較高，胃酸過多者請斟酌飲用'
            },
            
            // 霜淇淋系列
            {
                name: '霜淇淋紅茶',
                price: 95,
                category: getCategoryId('霜淇淋系列'),
                images: [
                    {
                        fileName: 'ice_cream_black_tea.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/icecreamtea?lock=51'
                    }
                ],
                hotCold: '冷',
                size: '中',
                selling: true,
                kal: 320,
                scores: {
                    wom: 4.8,
                    store: 4.7
                },
                introduction: '香醇紅茶上方綴以濃郁香草霜淇淋，冰熱交融，口感層次豐富。',
                alert: '內含乳製品，乳糖不耐者請斟酌飲用'
            },
            {
                name: '抹茶霜淇淋拿鐵',
                price: 110,
                category: getCategoryId('霜淇淋系列'),
                images: [
                    {
                        fileName: 'matcha_ice_cream_latte.jpg',
                        imgUrl: 'https://loremflickr.com/640/480/matchaicecream?lock=52'
                    }
                ],
                hotCold: '冷',
                size: '中',
                selling: true,
                kal: 350,
                scores: {
                    wom: 4.9,
                    store: 4.8
                },
                introduction: '日本宇治抹茶與鮮奶調製而成的抹茶拿鐵，上方為濃郁抹茶霜淇淋，層次豐富。',
                alert: '內含乳製品和咖啡因，孕婦及乳糖不耐者請斟酌飲用'
            }
        ]);

        console.log('飲品數據創建完成');

        console.log('所有示例數據創建完成！');

    } catch (error) {
        console.error('數據重置過程中出錯:', error);
    } finally {
        // 斷開數據庫連接
        mongoose.disconnect();
    }
};