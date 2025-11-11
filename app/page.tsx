export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-12">
        {/* ヒーローセクション */}
        <section className="mb-24 text-center">
          <div className="mb-6 inline-block rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
            ふたむらしょうたろう
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-6xl lg:text-7xl">
            二村昇太朗
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-600 dark:text-slate-400 sm:text-2xl">
            陸上競技で培った粘り強さと目標達成力を活かし、<br className="hidden sm:block" />
            IT業界で成長を続けています
          </p>
        </section>

        {/* 略歴セクション */}
        <section className="mb-24">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
              略歴
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-sky-300 to-transparent dark:from-sky-700" />
          </div>
          <div className="space-y-4">
            <div className="group relative overflow-hidden rounded-xl border border-sky-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-sky-800 dark:bg-slate-900/80 dark:hover:border-sky-700 dark:hover:shadow-sky-900/20">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    富山県富山市出身（2003年4月9日生まれ）
                  </p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl border border-sky-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-sky-800 dark:bg-slate-900/80 dark:hover:border-sky-700 dark:hover:shadow-sky-900/20">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    日本体育大学 体育学部 体育学科 2026年卒業
                  </p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl border border-sky-200 bg-white/80 p-6 backdrop-blur-sm transition-all hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-sky-800 dark:bg-slate-900/80 dark:hover:border-sky-700 dark:hover:shadow-sky-900/20">
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-sky-500 dark:bg-sky-400" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    東京のIT企業勤務
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 陸上競技歴セクション */}
        <section className="mb-24">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
              陸上競技歴
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-sky-300 to-transparent dark:from-sky-700" />
          </div>
          <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
            小学1年生から陸上競技を始め、16年間競技を継続。
          </p>
          
          <div className="space-y-8">
            {/* 小中学生時代 */}
            <div className="rounded-xl border border-sky-200 bg-white/80 p-8 backdrop-blur-sm dark:border-sky-800 dark:bg-slate-900/80">
              <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
                小中学生時代
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">全国小学生駅伝出走（5、6年）</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">全国中学陸上競技大会出走（1500m、3000m）</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">全国中学駅伝出走（3年）</span>
                </li>
              </ul>
            </div>

            {/* 高校時代 */}
            <div className="rounded-xl border border-sky-200 bg-white/80 p-8 backdrop-blur-sm dark:border-sky-800 dark:bg-slate-900/80">
              <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
                高校時代
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">仙台育英学園高等学校</span>
                </li>
              </ul>
            </div>

            {/* 大学時代 */}
            <div className="rounded-xl border border-sky-200 bg-white/80 p-8 backdrop-blur-sm dark:border-sky-800 dark:bg-slate-900/80">
              <h3 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl">
                大学時代（日本体育大学）
              </h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">関東IC 10000m出走（2年）</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">全日本大学駅伝5区出走（3年）</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">箱根駅伝10区出走（3年）</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">関東IC 5000m出走（4年）</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 text-sky-500 dark:text-sky-400">•</span>
                  <span className="text-lg">全日本大学駅伝4区出走（4年）</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 保有資格セクション */}
        <section className="mb-24">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
              保有資格
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-sky-300 to-transparent dark:from-sky-700" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="group rounded-xl border border-sky-200 bg-gradient-to-br from-white to-sky-50/50 p-6 transition-all hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-sky-800 dark:from-slate-900 dark:to-sky-950/30 dark:hover:border-sky-700 dark:hover:shadow-sky-900/20">
              <p className="font-semibold text-slate-900 dark:text-slate-50">ITパスポート試験</p>
            </div>
            <div className="group rounded-xl border border-sky-200 bg-gradient-to-br from-white to-sky-50/50 p-6 transition-all hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-sky-800 dark:from-slate-900 dark:to-sky-950/30 dark:hover:border-sky-700 dark:hover:shadow-sky-900/20">
              <p className="font-semibold text-slate-900 dark:text-slate-50">情報セキュリティマネジメント試験</p>
            </div>
            <div className="group rounded-xl border border-sky-200 bg-gradient-to-br from-white to-sky-50/50 p-6 transition-all hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-sky-800 dark:from-slate-900 dark:to-sky-950/30 dark:hover:border-sky-700 dark:hover:shadow-sky-900/20">
              <p className="font-semibold text-slate-900 dark:text-slate-50">基本情報技術者試験</p>
            </div>
            <div className="group rounded-xl border border-sky-200 bg-gradient-to-br from-white to-sky-50/50 p-6 transition-all hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100 dark:border-sky-800 dark:from-slate-900 dark:to-sky-950/30 dark:hover:border-sky-700 dark:hover:shadow-sky-900/20">
              <p className="font-semibold text-slate-900 dark:text-slate-50">応用情報技術者試験</p>
            </div>
          </div>
        </section>

        {/* 活動実績セクション */}
        <section className="mb-20">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
              活動実績
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-sky-300 to-transparent dark:from-sky-700" />
          </div>
          <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-white to-sky-50/50 p-8 backdrop-blur-sm dark:border-sky-800 dark:from-slate-900 dark:to-sky-950/30">
            <p className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-50">
              日本体育大学駅伝部 公式ホームページ作成・運用
            </p>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              大学卒業後は未経験からIT業界に挑戦。陸上競技で培った粘り強さと目標達成力を活かし、新しいフィールドで成長を続けています。
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
