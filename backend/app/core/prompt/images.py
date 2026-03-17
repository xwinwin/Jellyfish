
actor_portrait_prompt = PromptTemplate(
    input_variables=["character_description", "age", "gender", "style_ref", "extra_details"],
    template="""高质量电影级人像摄影，超详细专业演员写真，{gender}，大约{age}岁，{character_description}，

外貌特征：极致精致五官，电影感强烈的眼神，细腻皮肤纹理，真实毛孔和微小瑕疵，专业打光，电影布光方式，rim light + key light + fill light，电影感色调，

服装与风格：{style_ref}，高级质感服装，符合角色气质的服化道，细节丰富，布料纹理清晰，

画面要求：
- 超现实细节，8k分辨率，极致锐度
- 电影感浅景深，f/1.4，背景虚化明显
- 专业商业人像摄影风格 + 当代电影剧照质感
- 自然生动表情，富有故事感和角色沉浸感
- 优秀构图，经典三分法或黄金分割

{extra_details}

负面提示（强烈负面）：
low quality, worst quality, blurry, deformed, bad anatomy, bad hands, missing fingers, extra limbs, poorly drawn face, bad proportions, watermark, text, logo, signature, overexposed, underexposed, plastic skin, doll, cartoon, 3d render, cgi, illustration, painting, sketch, anime, ugly, morbid, mutilated
"""
)