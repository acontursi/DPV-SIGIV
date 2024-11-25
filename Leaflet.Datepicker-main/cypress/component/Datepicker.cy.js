/* 

The goal of this test is to test functionality added to and confguration of the vuepic datepicker used in the sea-ice-tracker

The first test (render) - checks the frequency of the calendar can be changed 
The remainder of the test checks that the up,down,left,right keys can be used to change the date, but not outside the allowed range for the datepicker

It is expected that the date displayed matches the requested date, and that an event with the new date is fired when the date is changed.

*/

import Datepicker from '../../src/Datepicker.vue' ;
import {ref} from 'vue' ;

describe('<Datepicker />', () => {

  let testDate = new Date('01 Nov 2020') ; //the expected/test date
  let callCount = 1 ; //number of event calls expected
  let freq = ref('monthly') ;

  function onDateChange(newDate) {
    //check date events emit the same date as expected
    assert.deepEqual(newDate,testDate) ;
  }

  //These three functions are to check the date displayed matches the expected valued
  function checkDayValue() {
    cy.get('[id=dayInput]').should((el) => {
      expect(parseInt(el[0]._value)).to.eq(testDate.getDate()) ;
    })
    checkMonthValue() ;
  }

  function checkMonthValue() {
    cy.get('[id=monthInput]')
    .should((el) => {
      expect(parseInt(el[0]._value)).to.eq(testDate.getMonth()+1) ;
    })
    checkYearValue() ;
  } 

  function checkYearValue() {
    cy.get('[id=yearInput]').should((el) => {
      expect(parseInt(el[0]._value)).to.eq(testDate.getFullYear()) ;
    })
  }

  //These three function are for pressuing a key with the day, month or year field selected.
  //expected keys are up, down, left and right
  function dayType(key) {
    cy.get('[id=dayInput]').type(key) ;
  }
  
  function monthType(key) {
    cy.get('[id=monthInput]').type(key) ;
  }

  function yearType(key) {
    cy.get('[id=yearInput]').type(key) ;
  }

  //These three functions are to check that the day, mount or year has been increment by the expected integer
  function incrementDayBy(i) {
    callCount += 1 ;
    testDate.setDate(testDate.getDate()+i)
    checkDayValue()
    cy.get('@onDateChangeSpy').should('have.callCount', callCount) ;
  }
  
  function incrementMonthBy(i) {
    callCount += 1 ;
    testDate.setMonth(testDate.getMonth()+i)
    checkMonthValue()
    cy.get('@onDateChangeSpy').should('have.callCount', callCount) ;
  }

  function incrementYearBy(i) {
    callCount += 1 ;
    testDate.setYear(testDate.getFullYear()+i)
    checkYearValue()
    cy.get('@onDateChangeSpy').should('have.callCount', callCount) ;
  }

  it('renders and frequency changes', () => {
    // Confirm that the datepicker is displayed, and fires an 'onDateChange' event when opened.
    // Confirm that the datepicker can be changed to monthly, daily, yearly and none frequencies
    const onDateChangeSpy = cy.spy(onDateChange).as('onDateChangeSpy') ;

    cy.mount(Datepicker, {
      props:{
        freq: freq ,
        date: ref(new Date('01 Nov 2020')) ,
        onDateChange:onDateChangeSpy
      }
    }).then(() => {

      //check it is showing the right date and that the dateChange event was emitted
        cy.get('[id=datepicker]').should('exist') ;
        cy.get('[id=dayInput]').should('not.exist') ;
        checkMonthValue() ;
        cy.get('@onDateChangeSpy').should('have.been.calledOnce') ;
      
    }).then(() => {

      //change to daily and check date
      freq.value = 'daily' ;

      cy.get('[id=datepicker]').should('exist') ;
      checkDayValue() ;

    }).then(() => {

      //change to yearly and check date
      freq.value = 'yearly' ;

      cy.get('[id=datepicker]').should('exist') ;
      cy.get('[id=dayInput]').should('not.exist') ;
      cy.get('[id=monthInput]').should('not.exist') ;

      checkYearValue() ;

    }).then(() => {

      //change to hidden
      freq.value = 'none' ;

      cy.get('[id=datepicker]').children().should('not.exist')

    }).then(() => {

      //unhide
      freq.value = 'monthly' ;
      cy.get('[id=datepicker]').children().should('exist')

    })
  }) ;

  it('updates from changes to ref', () => {
    // Confirm that the datepicker is displayed, and responds to external changes to the date
    // Confirm that the datepicker can be changed to monthly, daily, yearly and none frequencies
    const onDateChangeSpy = cy.spy(onDateChange).as('onDateChangeSpy') ;

    
    testDate = new Date('01 Nov 2020') ; //the expected/test date
    callCount = 1 ; //number of event calls expected
    freq = ref('daily') ;

    let datepickerDate=ref(testDate) ;

    cy.mount(Datepicker, {
      props:{
        freq:freq ,
        date: datepickerDate,
        onDateChange:onDateChangeSpy
      }
    }).then(() => {

      //check it is showing the right date and that the dateChange event was emitted
      cy.get('[id=datepicker]').should('exist') ;
      checkDayValue() ;
      cy.get('@onDateChangeSpy').should('have.been.calledOnce') ;
      
    }).then(() => {

      testDate=new Date('01 Jan 1980') 
      datepickerDate.value=testDate ;
      callCount++ ;
      checkDayValue() ;
      cy.get('@onDateChangeSpy').should('have.callCount', callCount) ;

    }).then(() => {

      testDate=new Date() 
      datepickerDate.value=testDate ;
      callCount++ ;

      checkDayValue() ;
      cy.get('@onDateChangeSpy').should('have.callCount', callCount) ;

    }).then(() => {

      freq.value='monthly'

      testDate=new Date('29 Feb 1980') 
      datepickerDate.value=testDate ;
      callCount++ ;

      checkMonthValue() ;
      cy.get('@onDateChangeSpy').should('have.callCount', callCount) ;

    }).then(() => {

      //change to yearly and check date
      freq.value = 'yearly' ;

      testDate=new Date('29 Feb 2000') 
      datepickerDate.value=testDate ;
      callCount++ ;

      checkYearValue() ;
      cy.get('@onDateChangeSpy').should('have.callCount', callCount) ;


    }).then(() => {

      //change to hidden
      freq.value = 'none' ;

      testDate=new Date('29 Feb 2020') 
      datepickerDate.value=testDate ;
      callCount++ ;

      cy.get('@onDateChangeSpy').should('have.callCount', callCount) ;

    }).then(() => {

      //unhide
      freq.value = 'daily' ;
      checkDayValue() ;

    }) 
  }) ;

  // run the following tests twice, once with the calendar open and once with it closed.
  for (let calendarOpen in [true, false]) {

    /* For each inputField (month, year, day) and calendar frequency (month, year, day):
    - confirm down left decrease the date
    - confirm up and right increase the date
    - confirm you can't decrease lower than the minDate
    - confirm you can't increase past the year of the maxDate
    */

    it('keyNavigationMonthly', () => {

      freq.value = 'monthly' ;
      testDate = new Date('01 Jan 2020') ;
      callCount = 1 ;
      
      const onDateChangeSpy = cy.spy(onDateChange).as('onDateChangeSpy') ;

      cy.mount(Datepicker, {
        props:{
          freq:freq ,
          date: ref(new Date('01 Jan 2020')) ,
          onDateChange:onDateChangeSpy
        }
      }).then(() =>{
        cy.get('@onDateChangeSpy').should('have.callCount',callCount) ;

        if (calendarOpen==true) {
          cy.get('[id=datepicker]').click() ;
          cy.get('[id=monthInput]').should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('exist');
        }
        else {
          cy.get('[id=monthInput]').should('not.be.focused') ;
          cy.get('[id=monthInput]').click().should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('not.exist');
        }
        //press the downarrow on the month field, confirm month is decreased by 1
        monthType('{downArrow}') ; incrementMonthBy(-1) ;
      }).then(() => {
        monthType('{leftArrow}') ; incrementMonthBy(-1) ;
      }).then(() => {
        monthType('{upArrow}') ; incrementMonthBy(1) ;
      }).then(() => {
        monthType('{rightArrow}') ; incrementMonthBy(1) ;
      }).then(() => {
        //re-run with a daily calendar
        freq.value = 'daily' ;
        cy.wait(500) ;
        if (calendarOpen==true) cy.get('[id=datepicker]').click() ;
        cy.get('[id=monthInput]').should('not.be.focused') ;
        cy.get('[id=monthInput]').click().should('be.focused') ;
        monthType('{downArrow}') ; incrementMonthBy(-1) ;
      }).then(() => {
        monthType('{leftArrow}') ; incrementMonthBy(-1) ;
      }).then(() => {
        monthType('{upArrow}') ; incrementMonthBy(1) ;
      }).then(() => {
        monthType('{rightArrow}') ; incrementMonthBy(1) ;
      })
    }) ;

    it('keyNavigationMonthlyAtMinMaxDate', () => {

      freq.value='monthly'
      callCount = 1 ;
      testDate = new Date('01 Jan 2023') ;
      testDate.setDate(1) ;
      testDate.setMonth(0) ;

      const onDateChangeSpy = cy.spy(onDateChange).as('onDateChangeSpy') ;
  
      cy.mount(Datepicker, {
        props:{
          freq: freq ,
          date: ref(new Date('01 Jan 2023'))  ,
          onDateChange:onDateChangeSpy,
          minDate:'01 Jan 2023',
          maxDateOffset:28
        }
      }).then(() => {

        if (calendarOpen==true) {
          cy.get('[id=datepicker]').click() ;
          cy.get('[id=monthInput]').should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('exist');
        }
        else {
          cy.get('[id=monthInput]').should('not.be.focused') ;
          cy.get('[id=monthInput]').click().should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('not.exist');

        }
        monthType('{downArrow}') ; incrementMonthBy(+11) ; //expected behaviour is to loop around the months when at the maxDate
      }).then(() => {
        monthType('{leftArrow}') ; incrementMonthBy(-1) ;
      }).then(() => {
        monthType('{upArrow}') ; incrementMonthBy(+1) ;
      }).then(() => {
        monthType('{rightArrow}') ; incrementMonthBy(-11) ;
      }).then(() => {
        freq.value = 'daily' ;
        cy.wait(500) ;
        if (calendarOpen==true) cy.get('[id=datepicker]').click() ;
        monthType('{downArrow}') ; incrementMonthBy(+11) ;
      }).then(() => {
        monthType('{leftArrow}') ; incrementMonthBy(-1) ;
      }).then(() => {
        monthType('{upArrow}') ; incrementMonthBy(+1) ;
      }).then(() => {
        monthType('{rightArrow}') ; incrementMonthBy(-11) ;
      })
    }) ;

    it('keyNavigationYearly', () => {

      freq.value='yearly'
      callCount = 1 ;
      testDate = new Date() ;
        
      const onDateChangeSpy = cy.spy(onDateChange).as('onDateChangeSpy') ;

      cy.mount(Datepicker, {
        props:{
          freq:freq ,
          date: ref(new Date(testDate) ) ,
          onDateChange:onDateChangeSpy
        }
      }).then(() =>{
        cy.get('@onDateChangeSpy').should('have.callCount',callCount) ;

        if (calendarOpen==true) {
          cy.get('[id=datepicker]').click() ;
          cy.get('[id=yearInput]').should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('exist');
        }
        else {
          cy.get('[id=yearInput]').should('not.be.focused') ;
          cy.get('[id=yearInput]').click().should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('not.exist');
        }

      }).then(() => {
        yearType('{downArrow}') ; incrementYearBy(-1) ;
      }).then(() => {
        yearType('{leftArrow}') ; incrementYearBy(-1) ;
      }).then(() => {
        yearType('{upArrow}') ; incrementYearBy(1) ;
      }).then(() => {
        yearType('{rightArrow}') ; incrementYearBy(1) ;
      }).then(() => {
        freq.value = 'monthly' ;
        cy.wait(500) ;
        if (calendarOpen==true) cy.get('[id=datepicker]').click() ;
        cy.get('[id=yearInput]').click().should('be.focused') ;
        yearType('{downArrow}') ; incrementYearBy(-1) ;
      }).then(() => {
        yearType('{leftArrow}') ; incrementYearBy(-1) ;
      }).then(() => {
        yearType('{upArrow}') ; incrementYearBy(1) ;
      }).then(() => {
        yearType('{rightArrow}') ; incrementYearBy(1) ;
      }).then(() => {
        freq.value = 'daily' ;
        cy.wait(500) ;
        if (calendarOpen==true) cy.get('[id=datepicker]').click() ;
        cy.get('[id=yearInput]').click().should('be.focused') ;
        yearType('{downArrow}') ; incrementYearBy(-1) ;
      }).then(() => {
        yearType('{leftArrow}') ; incrementYearBy(-1) ;
      }).then(() => {
        yearType('{upArrow}') ; incrementYearBy(1) ;
      }).then(() => {
        yearType('{rightArrow}') ; incrementYearBy(1) ;
      })
    }) ;

    it('keyNavigationYearlyAtMinMaxDate', () => {

      freq.value='yearly' ;
      testDate = new Date() ;
        
      const onDateChangeSpy = cy.spy(onDateChange).as('onDateChangeSpy') ;

      cy.mount(Datepicker, {
        props:{
          freq:freq ,
          date: ref(new Date(testDate)) ,
          onDateChange:onDateChangeSpy ,
          minDate:String(testDate),
          maxDateOffset:0
        }
      }).then(() =>{
        if (calendarOpen==true) {
          cy.get('[id=datepicker]').click() ;
          cy.get('[id=yearInput]').should('be.focused') ;
          cy.log(cy.focused());

          cy.get('[class=dp__instance_calendar]').should('exist');
        }
        else {
          cy.get('[id=yearInput]').should('not.be.focused') ;
          cy.get('[id=yearInput]').click().should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('not.exist');
        }
      }).then(() => {
        yearType('{downArrow}') ; checkYearValue() ;
      }).then(() => {
        yearType('{leftArrow}') ; checkYearValue() ;
      }).then(() => {
        yearType('{upArrow}') ; checkYearValue() ;
      }).then(() => {
        yearType('{rightArrow}') ; checkYearValue() ;
      }).then(() => {
        freq.value = 'monthly' ;
        cy.wait(500) ;
        if (calendarOpen==true) cy.get('[id=datepicker]').click() ;
        cy.get('[id=yearInput]').click().should('be.focused') ;
        yearType('{downArrow}') ; checkMonthValue() ;
      }).then(() => {
        yearType('{leftArrow}') ; checkMonthValue() ;
      }).then(() => {
        yearType('{upArrow}') ; checkMonthValue() ;
      }).then(() => {
        yearType('{rightArrow}') ; checkMonthValue() ;
      }).then(() => {
        freq.value = 'daily' ;
        cy.wait(500) ;
        if (calendarOpen==true) cy.get('[id=datepicker]').click() ;
        cy.get('[id=yearInput]').click().should('be.focused') ;
        yearType('{downArrow}') ; checkDayValue() ;
      }).then(() => {
        yearType('{leftArrow}') ; checkDayValue() ;
      }).then(() => {
        yearType('{upArrow}') ; checkDayValue() ;
      }).then(() => {
        yearType('{rightArrow}') ; checkDayValue() ;
      })
    }) ;

    it('keyNavigationDaily', () => {

      freq.value='daily' ;
      callCount = 1 ;
      testDate = new Date() ;
      
      const onDateChangeSpy = cy.spy(onDateChange).as('onDateChangeSpy') ;

      cy.mount(Datepicker, {
        props:{
          freq:freq ,
          date: ref(new Date(testDate)) ,
          onDateChange:onDateChangeSpy
        }
      }).then(() =>{
        cy.get('@onDateChangeSpy').should('have.callCount',callCount) ;

        if (calendarOpen==true) {
          cy.get('[class="dp__icon dp__input_icon dp__input_icons"]').click() ;
          cy.get('[id=dayInput]').should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('exist');
        }
        else {
          cy.get('[id=dayInput]').should('not.be.focused') ;
          cy.get('[id=dayInput]').click().should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('not.exist');
        }
        dayType('{downArrow}') ; incrementDayBy(-1) ;
      }).then(() => {
        dayType('{leftArrow}') ; incrementDayBy(-1) ;
      }).then(() => {
        dayType('{upArrow}') ; incrementDayBy(1) ;
      }).then(() => {
        dayType('{rightArrow}') ; incrementDayBy(1) ;
      })
    }) ;

    it('keyNavigationDailyAtMinMaxDate', () => {

      freq.value='daily'

      testDate = new Date() ;
      
      const onDateChangeSpy = cy.spy(onDateChange).as('onDateChangeSpy') ;

      cy.mount(Datepicker, {
        props:{
          freq:freq ,
          date: ref(new Date(testDate)) ,
          onDateChange:onDateChangeSpy ,
          minDate: String(testDate) ,
          maxDate: 0 
        }
      }).then(() =>{
        if (calendarOpen==true) {
          cy.get('[class="dp__icon dp__input_icon dp__input_icons"]').click() ;
          cy.get('[id=dayInput]').should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('exist');
        }
        else {
          cy.get('[id=dayInput]').should('not.be.focused') ;
          cy.get('[id=dayInput]').click().should('be.focused') ;
          cy.get('[class=dp__instance_calendar]').should('not.exist');
        }
        dayType('{downArrow}') ; checkDayValue() ;
      }).then(() => {
        dayType('{leftArrow}') ; checkDayValue() ;
      })/* For reasons of simplicity / improving useability, navigation to invalid dates through the up arrow is not blocked
      .then(() => {
        dayType('{upArrow}') ; checkDayValue() ;
      }).then(() => {
        dayType('{rightArrow}') ; checkDayValue() ;
      }) */
    }) ;
}

})
