---
name: Cards
route: /Cards
menu: Layout
# menu: Layout / 布局
---

import { Playground, PropsTable } from 'docz'
import { Card, CardContainer } from '../../src/core/card';

# Card And CardContainer

[参考布局系统](#/Grid)

<Playground style={{height: 1200, backgroundColor: '#f6f6f6'}}>
  <h4>j-c-b</h4>
  <CardContainer className="j-c-b">
    <Card row={10} className="m10">
      <div className="p10">
        <h3>如题 row-9</h3>
        <hr/>
        <p>人类的本质是一部复读机上集</p>
      </div>
    </Card>
    <Card row={10} className="m10">
      <div className="p10">
        <h3>如题 row-9</h3>
        <hr/>
        <p>人类的本质是一部复读机下级</p>
      </div>
    </Card>
  </CardContainer>
  <hr/>
  <h4>j-c-b</h4>
  <CardContainer className="j-c-b">
    <Card row={6}>
      <div className="p10">
        <h3>如题 row-6</h3>
        <hr/>
        <p>人类的本质是一部复读机上集</p>
      </div>
    </Card>
    <Card row={6}>
      <div className="p10">
        <h3>如题 row-6</h3>
        <hr/>
        <p>人类的本质是一部复读机下级</p>
      </div>
    </Card>
    <Card row={6}>
      <div className="p10">
        <h3>如题 row-6</h3>
        <hr/>
        <p>人类的本质是一部复读机下级</p>
      </div>
    </Card>
  </CardContainer>
  <hr/>
  <h4>j-c-c</h4>
  <CardContainer className="j-c-c">
    <Card row={6} className="m10">
      <div className="p10">
        <h3>如题 row-6</h3>
        <hr/>
        <p>人类的本质是一部复读机上集</p>
      </div>
    </Card>
    <Card row={6} className="m10">
      <div className="p10">
        <h3>如题 row-6</h3>
        <hr/>
        <p>人类的本质是一部复读机下级</p>
      </div>
    </Card>
    <Card row={6} className="m10">
      <div className="p10">
        <h3>如题 row-6</h3>
        <hr/>
        <p>人类的本质是一部复读机下级</p>
      </div>
    </Card>
  </CardContainer>
  <hr/>
  <h4>竖排版 isCol</h4>
  <CardContainer className="j-c-c" isCol>
    <Card className="m10">
      <div className="p10">
        <h3>如题 row-6</h3>
      </div>
    </Card>
    <Card className="m10">
      <div className="p10">
        <h3>如题 row-6</h3>
      </div>
    </Card>
    <Card row={6} className="m10">
      <div className="p10">
        <h3>如题 row-6</h3>
      </div>
    </Card>
  </CardContainer>
</Playground>
