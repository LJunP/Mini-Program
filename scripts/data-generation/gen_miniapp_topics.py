#!/usr/bin/env python3
"""Generate miniapp topic JS files with 5 selected questions each."""
import json
import os

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
data_path = os.path.join(base_dir, 'data', 'study_data.json')
topics_dir = os.path.join(base_dir, 'miniapp', 'data', 'study', 'topics')

with open(data_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for topic_name in ['algorithms', 'performance', 'security', 'system_design']:
    questions = data['topics'].get(topic_name, [])
    sorted_qs = sorted(questions, key=lambda q: q.get('frequency', 3) * q.get('difficulty', 2), reverse=True)
    selected = sorted_qs[:5]
    
    js_content = '// interview-' + topic_name + '.js\n'
    js_content += '// 提审精简版（原完整版已备份至 cdn_backup，上线后由云开发数据库动态下发）\n\n'
    js_content += 'const questions = '
    js_content += json.dumps(selected, ensure_ascii=False, indent=2)
    js_content += ';\n\nmodule.exports = questions;\n'
    
    filepath = os.path.join(topics_dir, 'interview-' + topic_name + '.js')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f'Updated {filepath} with {len(selected)} questions')
    for q in selected:
        print(f'  - {q["id"]}: {q["title"]}')

print('\nDone! All 4 miniapp topic files updated.')
