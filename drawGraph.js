async function drawGraph() {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=35.69&longitude=139.69&hourly=pressure_msl&timezone=Asia%2FTokyo&past_days=14";
    var res = await fetch(url);
    var json = await res.json();

    // 現在時刻（1時間未満切り捨て）の取得
    const nowLocal = new Date();
    const diff = nowLocal.getTimezoneOffset() * 60 * 1000;
    const plusLocal = new Date(nowLocal - diff);
    var iso = plusLocal.toISOString();
    var localtime = iso.slice(0, 14) + '00';

    // 現在時刻の添え字を検索
    var currentIndex = json.hourly.time.findIndex((element) => element.toString() == localtime);

    // 今日の縦線用のデータセット
    var todayIndex = Array(json.hourly.time.length);
    todayIndex.fill(0);
    todayIndex[currentIndex] = 1030;

    // グラフ描画
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: json.hourly.time,
            datasets: [
                {
                    label: 'tokyo',
                    data: json.hourly.pressure_msl,
                    type: 'line'
                },
                {
                    label: 'today',
                    data: todayIndex
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    min: 970,
                    max: 1030
                },
            },
            plugins: {
                legend: {
                    display: false,
                    align: 'start'
                }
            }
        }
    });
};