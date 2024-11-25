<!--
Extend the vue datepicker by:
	configuring range of allowed dates
	switching between desired annual, monthly and daily frequency
	adding key navigation

	properties:
		date: ref with the start date or date set outside the datepicker ,
		minDate: first date allowed to be chosen ,
		maxDate: last date allowed to be chosen ,
		freq: which calender to show, 'daily'|'monthly'|'yearly'|'none' (reactive)

	events:
		dateChange: emits a new Date object with the new date in the calendar

	Key navigation:
		clicking on the day/year/month on the calendar should then allow navigation using the up/right and down/left keys to increase or decrease the selected part of the date.

 -->

<script setup>
	import '@vuepic/vue-datepicker/dist/main.css' ;
	import { ref , watch } from 'vue' ;
	import Datepicker from '@vuepic/vue-datepicker';
	import CalendarIcon from '../node_modules/@vuepic/vue-datepicker/src/VueDatePicker/components/Icons/CalendarIcon.ts'; 

	const emit = defineEmits({
		dateChange: (eventDate) => {
			if (eventDate instanceof Date) { return true ; }
			else {console.debug('Internal Error: Attempting to set date without using a date object') ; return false ; }
		}
	}) ;

	let options = defineProps({
		date: { type:Object , default:ref(new Date()) } , 
		minDate: {
			default:'01 Jan 1980',
			validator(d) {
				return new Date(d)!='Invalid Date' ;
			}
		},
		maxDate: { 
			default: null , //default is yesterday, set below
			validator(d) {
				return new Date(d)!='Invalid Date' ;
			}
		}, 
		freq: {
			type: Object , 
			default: ref('none'), 
			validator(value) {
				return ['daily', 'monthly', 'yearly', 'none'].includes(value.value) ;
			}
		}
	} ) ;

	watch(options.date, (newDate) => {
		if (dateInRange(newDate)) {
			console.log('new date')
			date.value=newDate;
			month.value.year=newDate.getFullYear() ;
			month.value.month=newDate.getMonth() ;
			emit('dateChange', date.value) 
		} else {
			console.debug(' new date out of range');
			emit('dateChange', date.value) ;
		}
	})
	//POSSIBLE TO-DO:
	// Check that minDate<=startDate and maxDate>=startDate

	const dayInput = ref(null) ;
	const monthInput = ref(null) ;
	const yearInput = ref(null) ;
	const datepicker = ref(null) ;

	let today = new Date() ;
	let minDate = new Date(options.minDate) ;

	let maxDate ;
	if (options.maxDate) {
		maxDate = new Date(options.maxDate) ;
	} else {
		// default max date to yesterday
		maxDate = new Date() ;
		maxDate.setTime(today.getTime()-1*60*60*24*1000) ;
	}

	const pickerAttrs = {
		autoApply:true,
		closeOnAutoApply:false,
		minDate:minDate, 
		maxDate:maxDate,
		preventMinMaxNavigation:true,
		enableTimePicker:false,
		textInput:true, 
		clearable:false,
	} ;

	//We are using two vars to track the state of day, month, year, which are written to by the datepicker depending on which freq is set in the datepicker
	
	let date=ref(options.date.value) ;
	let month=ref({month:date.value.getMonth(), year:date.value.getFullYear()}) ;
	
	emit('dateChange', date.value ) ;
	
	// some functions to handle date changes
	const dateInRange = (date) => {
		if (minDate<=date && (date.getFullYear()<=maxDate.getFullYear())) { return true ; } 
		else { return false ;} ;
	}

	const handleDay = (modelData) => {
		month.value.year=modelData.getFullYear() ;
		month.value.month=modelData.getMonth() ;
		emit('dateChange', date.value) ;
		dayInput.value.focus() ;
	}
	
	const handleMonth = (modelData) => {
		const newDate = new Date(date.value) ;
		newDate.setMonth(modelData.month) ;
		newDate.setYear(modelData.year) ;
		date.value=newDate;
		month.value={'month':newDate.getMonth(),'year':newDate.getFullYear()} //If the old date was the 31st day of the month, this might increment by 0/2 months, instead of the 1 expecte by the keypress, so check from the date value (might not match modelData anymore) ;
		emit('dateChange', date.value) ;
		monthInput.value.focus() ;
	} 
	
	const handleYear = (modelData) => {
		const newDate = new Date(date.value) ;
		newDate.setYear(modelData) ;
		date.value=newDate;
		month.value={'month':newDate.getMonth(),'year':newDate.getFullYear()} //If the old date was the 29th of feb, changing the year increments to 1st march, so need to set the month using the newDate (might not match modelData anymore) 
		emit('dateChange', date.value) ;
		yearInput.value.focus() ;
	}

	// for keyboard functionality, some functions to use with up and down arrow keys

	const dayUp = () => { 
		const newDate = new Date(date.value) ; 
		newDate.setTime(newDate.getTime()+1*60*60*24*1000) ;
		if (dateInRange(newDate)) {
			date.value=newDate;
			month.value.year=newDate.getFullYear() ;
			month.value.month=newDate.getMonth() ;
		}
	}

	const dayDown = () => { 
		const newDate = new Date(date.value) ; 
		newDate.setTime(newDate.getTime()-1*60*60*24*1000) ;
		if (dateInRange(newDate)) {
			date.value=newDate;
			month.value.year=newDate.getFullYear() ;
			month.value.month=newDate.getMonth() ;
		} ;
	}

	const monthUp = () => {
		if (month.value.month==11) {
			month.value.month=0 ;
			if (month.value.year<maxDate.getFullYear()) {
				month.value.year++ ;
			}
		} else {
			month.value.month++ ;
		}
	}

	const monthDown = () => {
		if (month.value.month===0) {
			month.value.month=11 ;
			if (month.value.year>minDate.getFullYear()) {
				month.value.year-- ;
			}
		} else {
			month.value.month-- ;
		}
	}

	const yearUp = () => { 
		if (month.value.year<maxDate.getFullYear()) {month.value.year++ ; } ; 
	}

	const yearDown = (year) => { 
		if (month.value.year>minDate.getFullYear()) {month.value.year--; } ; 
	}

</script>

<template> 

	<div v-if="options.freq.value==='none'" class="control-back" style="visibility: hidden" id="datepicker"></div>
	<div v-else class="control-back" id="datepicker">
		<Datepicker 
			v-if="options.freq.value==='monthly'" v-model="month" monthPicker v-bind="pickerAttrs" ref="datepicker"
			@update:modelValue="handleMonth" @open="monthInput.focus()" @close="monthInput.blur()" @keydown.esc="datepicker.closeMenu()" @keydown.enter="datepicker.closeMenu()"
		>
			<template #dp-input="{value}" >
				<CalendarIcon class="dp__input_icon dp__input_icons" />
				<div class="dp__pointer dp__input dp__input_readonly dp__input_icon_pad dp__input_focus dp__input_reg">
					<input 
						inputmode='none' class="dp__input dp_input_field" :value="value.substr(0,2)" ref="monthInput" id="monthInput"
						@keydown.up="monthUp()" @keydown.right="monthUp()" @keydown.down="monthDown()" @keydown.left="monthDown()"
						@keyup.up="handleMonth(month)" @keyup.right="handleMonth(month)" @keyup.down="handleMonth(month)" @keyup.left="handleMonth(month)"
						@click.stop="monthInput.focus()"
					/>
					<span class="dp__input" style="border:none; padding:0" @click.stop="monthInput.focus()">/</span>
					<input 
						inputmode='none' class="dp__input dp_input_field" :value="value.substr(3,7)" ref="yearInput" id="yearInput"
						@keydown.up="yearUp()" @keydown.right="yearUp()" @keydown.down="yearDown()" @keydown.left="yearDown()" 
						@keyup.up="handleYear(month.year)" @keyup.right="handleYear(month.year)" @keyup.down="handleYear(month.year)" @keyup.left="handleYear(month.year)" 
						@click.stop="yearInput.focus()"
					/>
				</div>
			</template>
		</Datepicker>
		<Datepicker 
			v-else-if="options.freq.value==='yearly'" v-model="month.year" yearPicker v-bind="pickerAttrs" ref="datepicker"
			@update:modelValue="handleYear" @open="yearInput.focus()" @close="yearInput.blur()" @keydown.esc="datepicker.closeMenu()" @keydown.enter="datepicker.closeMenu()"
		>
			<template #dp-input="{value}" >
				<CalendarIcon class="dp__input_icon dp__input_icons" />
				<div class="dp__pointer dp__input dp__input_readonly dp__input_icon_pad dp__input_focus dp__input_reg">
					<input 
						inputmode='none' class="dp__input dp_input_field" :value="value" ref="yearInput" id="yearInput"
						@keydown.up="yearUp()" @keydown.right="yearUp()" @keydown.down="yearDown()" @keydown.left="yearDown()" 
						@keyup.up="handleYear(month.year)" @keyup.right="handleYear(month.year)" @keyup.down="handleYear(month.year)" @keyup.left="handleYear(month.year)" 
						@click.stop="yearInput.focus()"
					/>
				</div>
			</template>
		</Datepicker>
		<Datepicker 
			v-else-if="options.freq.value==='daily'" v-model="date" dayPicker v-bind="pickerAttrs" ref="datepicker"
			@update:modelValue="handleDay" @open="dayInput.focus()" @close="dayInput.blur()" @keydown.esc="datepicker.closeMenu()" @keydown.enter="datepicker.closeMenu()"
			>
			<template #dp-input="{value}" >
				<CalendarIcon class="dp__input_icon dp__input_icons" />
				<div class="dp__pointer dp__input dp__input_readonly dp__input_icon_pad dp__input_focus dp__input_reg">
					<input 
						inputmode='none' class="dp__input dp_input_field" :value="value.substr(3,2)" ref="dayInput" id="dayInput"
						@keydown.up="dayUp()" @keydown.right="dayUp()" @keydown.down="dayDown()" @keydown.left="dayDown()"
						@keyup.up="handleDay(date)" @keyup.right="handleDay(date)" @keyup.down="handleDay(date)" @keyup.left="handleDay(date)" 
						@click.stop="dayInput.focus()"
					/>
					<span class="dp__input" style="border:none; padding:0" @click.stop="dayInput.focus()">/</span>
					<input 
						inputmode='none' class="dp__input dp_input_field" :value="`${String(month.month+1).padStart(2,0)}`" ref="monthInput" id="monthInput"
						@keydown.up="monthUp()" @keydown.right="monthUp()" @keydown.down="monthDown()" @keydown.left="monthDown()"
						@keyup.up="handleMonth(month)" @keyup.right="handleMonth(month)" @keyup.down="handleMonth(month)" @keyup.left="handleMonth(month)" 
						@click.stop="monthInput.focus()"
					/>
					<span class="dp__input" style="border:none; padding:0" @click.stop="monthInput.focus()">/</span>
					<input 
						inputmode='none' class="dp__input dp_input_field" :value="month.year" ref="yearInput" id="yearInput"
						@keydown.up="yearUp()" @keydown.right="yearUp()" @keydown.down="yearDown()" @keydown.left="yearDown()" 
						@keyup.up="handleYear(month.year)" @keyup.right="handleYear(month.year)" @keyup.down="handleYear(month.year)" @keyup.left="handleYear(month.year)" 
						@click.stop="yearInput.focus()"
					/>
				</div>
			</template>
		</Datepicker>
	</div>

</template>

<style>
	#monthInput {
		width:19px ;
	}
	#dayInput {
		width:19px ;
	}
	#yearInput {
		width:38px ;
	}
	.dp_input_field {
		border:none; 
		padding:0;
	}
	.dp_input_field:focus {
		background-color: #f0f0f0;
	}
	#datepicker{
		padding: 5px ;
		grid-row: 1 ;
		width: 246px ;
		height: 38px ;
		z-index:810 ;
		border: 2px solid rgba(0,0,0,0.2);
		background-clip: padding-box;
		border-radius: 5px ;
	}
</style>