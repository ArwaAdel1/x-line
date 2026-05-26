/**
 * seed.js — يرفع البيانات الأولية إلى MongoDB
 * شغّله مرة واحدة:  node seed.js
 */
require('dotenv').config();
const mongoose    = require('mongoose');
const Service     = require('./models/Service');
const Team        = require('./models/Team');
const Project     = require('./models/Project');
const Blog        = require('./models/Blog');
const Faq         = require('./models/Faq');
const Testimonial = require('./models/Testimonial');
const SiteInfo    = require('./models/SiteInfo');

const SERVICES = [
  { icon:'🏗️', ar:'البناء والتشييد', en:'Construction', descAr:'تنفيذ المباني السكنية والتجارية والصناعية بأعلى مواصفات الجودة', descEn:'Residential, commercial and industrial buildings to the highest quality standards', features:{ ar:['هياكل خرسانية متطورة','أنظمة بناء حديثة','مواد بناء معتمدة','ضمان شامل'], en:['Advanced concrete structures','Modern building systems','Certified materials','Full warranty'] }, active:true, order:1 },
  { icon:'📐', ar:'التصميم الهندسي', en:'Engineering Design', descAr:'تصميم معماري وإنشائي متكامل يجمع بين الجماليات والوظيفة', descEn:'Integrated architectural and structural design combining aesthetics and function', features:{ ar:['تصميم معماري إبداعي','حسابات إنشائية دقيقة','نماذج BIM ثلاثية الأبعاد'], en:['Creative architectural design','Accurate structural calculations','Full 3D BIM models'] }, active:true, order:2 },
  { icon:'🔧', ar:'الصيانة والترميم', en:'Maintenance & Restoration', descAr:'صيانة دورية وترميم شامل للمنشآت القائمة وتجديدها', descEn:'Periodic maintenance and comprehensive restoration of existing structures', features:{ ar:['صيانة وقائية دورية','ترميم الواجهات','معالجة الرطوبة'], en:['Preventive maintenance','Facade restoration','Humidity treatment'] }, active:true, order:3 },
  { icon:'📋', ar:'إدارة المشاريع', en:'Project Management', descAr:'إدارة احترافية متكاملة لضمان تسليم مشروعك في الوقت المحدد', descEn:'Professional integrated management to ensure on-time delivery', features:{ ar:['تخطيط شامل','متابعة يومية','تقارير دورية'], en:['Comprehensive planning','Daily follow-up','Periodic reports'] }, active:true, order:4 },
  { icon:'⚡', ar:'الأعمال الكهربائية', en:'Electrical Works', descAr:'تركيب جميع الأنظمة الكهربائية وفق أحدث المعايير', descEn:'All electrical systems installation according to latest standards', features:{ ar:['لوحات التوزيع','أنظمة الإضاءة الذكية','الطاقة الشمسية'], en:['Distribution panels','Smart lighting','Solar energy'] }, active:true, order:5 },
  { icon:'💧', ar:'الأعمال الميكانيكية', en:'Mechanical Works', descAr:'جميع أعمال السباكة والتكييف وأنظمة الصرف', descEn:'All plumbing, AC and drainage systems', features:{ ar:['أنظمة تكييف مركزية','شبكات الصرف الصحي'], en:['Central AC systems','Sanitary drainage'] }, active:true, order:6 },
];

const TEAM = [
  { emoji:'👨‍💼', photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', nameAr:'م. أحمد العمري', nameEn:'Eng. Ahmed Al-Omari', roleAr:'المدير التنفيذي', roleEn:'CEO', bioAr:'مهندس مدني بخبرة 22 عاماً في إدارة المشاريع الكبرى', bioEn:'Civil engineer with 22 years managing mega projects', active:true, order:1 },
  { emoji:'👩‍🏗️', photo:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face', nameAr:'م. سارة الحربي', nameEn:'Eng. Sara Al-Harbi', roleAr:'المدير الهندسي', roleEn:'Engineering Director', bioAr:'متخصصة في التصميم الإنشائي وهندسة الجودة', bioEn:'Specialist in structural design and quality engineering', active:true, order:2 },
  { emoji:'👨‍🔬', photo:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face', nameAr:'م. خالد الدوسري', nameEn:'Eng. Khalid Al-Dosari', roleAr:'مدير المشاريع', roleEn:'Projects Director', bioAr:'خبير في إدارة المشاريع وتطبيق معايير الجودة العالمية', bioEn:'Expert in project management and global quality standards', active:true, order:3 },
  { emoji:'👩‍💻', photo:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face', nameAr:'م. نورة السعدي', nameEn:'Eng. Noura Al-Saadi', roleAr:'المهندسة المعمارية', roleEn:'Architect', bioAr:'مصممة معمارية متميزة تجمع بين الحداثة والأصالة', bioEn:'Distinguished architect combining modernity with authenticity', active:true, order:4 },
  { emoji:'👨‍🔧', photo:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', nameAr:'م. فيصل المطيري', nameEn:'Eng. Faisal Al-Mutairi', roleAr:'مدير الصيانة', roleEn:'Maintenance Manager', bioAr:'متخصص في أنظمة الصيانة الوقائية', bioEn:'Specialist in preventive maintenance systems', active:true, order:5 },
  { emoji:'👩‍⚖️', photo:'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&h=400&fit=crop&crop=face', nameAr:'أ. ليلى الشمري', nameEn:'Ms. Layla Al-Shammari', roleAr:'مديرة المالية', roleEn:'Finance Manager', bioAr:'خبيرة مالية تدير ميزانيات المشاريع باحترافية', bioEn:'Financial expert managing project budgets professionally', active:true, order:6 },
];

const PROJECTS = [
  { nameAr:'برج الأعمال المركزي', nameEn:'Central Business Tower', statusAr:'منجز', statusEn:'Completed', year:2023, active:true, order:1 },
  { nameAr:'مجمع الوحدات السكنية', nameEn:'Residential Complex', statusAr:'جارٍ', statusEn:'In Progress', year:2024, active:true, order:2 },
  { nameAr:'مستشفى الأمل الجديد', nameEn:'New Hope Hospital', statusAr:'منجز', statusEn:'Completed', year:2022, active:true, order:3 },
  { nameAr:'مشروع الطريق السريع', nameEn:'Highway Project', statusAr:'مخطط', statusEn:'Planned', year:2025, active:true, order:4 },
];

const BLOGS = [
  { emoji:'🏗️', titleAr:'إنجاز برج الأعمال المركزي بالرياض', titleEn:'Completion of Central Business Tower in Riyadh', excerptAr:'أعلنت شركة البناء الراسخ عن إتمام مشروع برج الأعمال المركزي في قلب الرياض بنجاح تام وفي الموعد المحدد.', excerptEn:'Solid Build announced the successful completion of the Central Business Tower project in the heart of Riyadh, on schedule.', tagAr:'إنجازات', tagEn:'Achievements', date:'2024-03-15', active:true },
  { emoji:'💡', titleAr:'تبني تقنية BIM في جميع مشاريعنا', titleEn:'Adopting BIM Technology Across All Our Projects', excerptAr:'تعتمد الشركة اليوم تقنية نمذجة معلومات البناء BIM كمعيار أساسي في جميع مشاريعها.', excerptEn:'The company now adopts BIM technology as a core standard across all its projects.', tagAr:'تقنية', tagEn:'Technology', date:'2024-01-20', active:true },
  { emoji:'🏆', titleAr:'نحصد جائزة أفضل شركة مقاولات 2024', titleEn:'We Win Best Construction Company Award 2024', excerptAr:'حصدت شركة البناء الراسخ جائزة أفضل شركة مقاولات للعام 2024 من مجلس المقاولين السعوديين.', excerptEn:'Solid Build won the Best Construction Company Award for 2024 from the Saudi Contractors Council.', tagAr:'جوائز', tagEn:'Awards', date:'2023-12-05', active:true },
];

const FAQS = [
  { questionAr:'ما هي المناطق الجغرافية التي تخدمونها؟', questionEn:'What geographic areas do you serve?', answerAr:'نخدم جميع مناطق المملكة العربية السعودية مع التركيز على الرياض وجدة والمنطقة الشرقية.', answerEn:'We serve all regions of Saudi Arabia with a focus on Riyadh, Jeddah, and the Eastern Province.', active:true, order:1 },
  { questionAr:'كم يستغرق تنفيذ المشاريع السكنية؟', questionEn:'How long does it take to complete residential projects?', answerAr:'يتوقف الوقت على حجم المشروع، لكن في المتوسط تستغرق الوحدات السكنية من 8 إلى 18 شهراً.', answerEn:'It depends on the project size, but on average residential units take 8 to 18 months.', active:true, order:2 },
  { questionAr:'هل تقدمون ضماناً على أعمالكم؟', questionEn:'Do you offer a warranty on your work?', answerAr:'نعم، نقدم ضماناً شاملاً لمدة 5 سنوات على الهيكل الإنشائي وسنة على الأعمال التشطيبية.', answerEn:'Yes, we offer a comprehensive 5-year warranty on the structural framework and 1 year on finishing works.', active:true, order:3 },
  { questionAr:'كيف يمكنني الحصول على عرض سعر؟', questionEn:'How can I get a price quote?', answerAr:'يمكنك التواصل معنا عبر صفحة تواصل معنا وسيتواصل معك فريقنا خلال 24 ساعة.', answerEn:'Contact us via the contact page and our team will reach out within 24 hours.', active:true, order:4 },
  { questionAr:'هل تتعاملون مع المشاريع الحكومية؟', questionEn:'Do you work on government projects?', answerAr:'نعم، لدينا خبرة واسعة في المشاريع الحكومية ونحمل جميع التراخيص والاعتمادات اللازمة.', answerEn:'Yes, we have extensive experience in government projects and hold all necessary licenses.', active:true, order:5 },
];

const TESTIMONIALS = [
  { nameAr:'محمد السالم', nameEn:'Mohammed Al-Salem', roleAr:'مالك مجمع تجاري', roleEn:'Commercial Complex Owner', textAr:'شركة البناء الراسخ تجاوزت كل توقعاتي. التزام بالمواعيد وجودة عالية في كل التفاصيل.', textEn:'Solid Build exceeded all my expectations. On-time delivery and high quality in every detail.', stars:5, active:true },
  { nameAr:'نوف العتيبي', nameEn:'Nouf Al-Otaibi', roleAr:'مديرة مشروع سكني', roleEn:'Residential Project Manager', textAr:'تعاملت معهم في مشروع سكني كبير وكانوا على قدر المسؤولية في كل مرحلة.', textEn:'I worked with them on a large residential project and they were up to the task at every stage.', stars:5, active:true },
  { nameAr:'عبدالله القحطاني', nameEn:'Abdullah Al-Qahtani', roleAr:'صاحب مصنع', roleEn:'Factory Owner', textAr:'فريق متخصص ومحترف، أنجزوا المشروع قبل الموعد المحدد بأسبوعين كاملين.', textEn:'Professional team, they completed the project two full weeks ahead of schedule.', stars:5, active:true },
];

const SITEINFO = {
  nameAr:'شركة لاين التطوير والإبداع', nameEn:'LINE Development and Innovation Co.',
  address:'المملكة العربية السعودية',
  phone:'+966 55 430 0235',
  email:'Info@lineil.com',
  logo:''
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ متصل بـ MongoDB');

  await Service.deleteMany({});
  await Service.insertMany(SERVICES);
  console.log(`✅ services: ${SERVICES.length} وثيقة`);

  await Team.deleteMany({});
  await Team.insertMany(TEAM);
  console.log(`✅ team: ${TEAM.length} وثيقة`);

  await Project.deleteMany({});
  await Project.insertMany(PROJECTS);
  console.log(`✅ projects: ${PROJECTS.length} وثيقة`);

  await Blog.deleteMany({});
  await Blog.insertMany(BLOGS);
  console.log(`✅ blogs: ${BLOGS.length} وثيقة`);

  await Faq.deleteMany({});
  await Faq.insertMany(FAQS);
  console.log(`✅ faqs: ${FAQS.length} وثيقة`);

  await Testimonial.deleteMany({});
  await Testimonial.insertMany(TESTIMONIALS);
  console.log(`✅ testimonials: ${TESTIMONIALS.length} وثيقة`);

  await SiteInfo.deleteMany({});
  await SiteInfo.create(SITEINFO);
  console.log('✅ siteinfo: رُفع');

  await mongoose.disconnect();
  console.log('\n🎉 الـ Seed خلص! البيانات الآن في MongoDB');
}

seed().catch(err => {
  console.error('❌ خطأ:', err.message);
  process.exit(1);
});
