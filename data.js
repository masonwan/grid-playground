'use strict';

var data = [
	{"imageId":"41f4hX7sLFL","price":16.99},
	{"imageId":"41bO53HVaJL","price":21.04},
	{"imageId":"41qtn4TicbL","price":12},
	{"imageId":"41h%2BGGdu5cL","price":18.57},
	{"imageId":"411oowREhHL","price":18.05},
	{"imageId":"31mPWfBspHL","price":12.78},
	{"imageId":"51exNSeLtpL","price":19.58},
	{"imageId":"51nf9TAzTjL","price":15.2},
	{"imageId":"41gU1WULXpL","price":12.99},
	{"imageId":"41L3bPaPuTL","price":15.21},
	{"imageId":"41jSEcAXyfL","price":21.69},
	{"imageId":"41mh2bdHKFL","price":17.42},
	{"imageId":"51L-a0ha7IL","price":2.9},
//	{"imageId":"41IQ3S0shqL","price":7.92},
//	{"imageId":"41It5yz52oL","price":3.75},
//	{"imageId":"41mh2bdHKFL","price":20.12},
//	{"imageId":"41uf1SU1seL","price":15.73},
//	{"imageId":"41gf1gIyZSL","price":19.42},
//	{"imageId":"41zzL2xEDuL","price":14.93},
//	{"imageId":"415MBvPpXAL","price":18.5},
//	{"imageId":"41QqFEmU3DL","price":14.31},
//	{"imageId":"41gFB503bKL","price":19.46},
//	{"imageId":"41YwY2Xh5tL","price":18.82},
//	{"imageId":"41oJAPjEnGL","price":16.47},
//	{"imageId":"41GMEfHdjvL","price":14.64},
//	{"imageId":"41NeDJ3RkSL","price":32.71},
//	{"imageId":"41MXpjkfkIL","price":15.99},
//	{"imageId":"41d5OL7OaYL","price":29.46},
//	{"imageId":"41JmTy3IOiL","price":2.06},
//	{"imageId":"41qub3h2RJL","price":27.47},
//	{"imageId":"517MAmMDn%2BL","price":8.59},
//	{"imageId":"41i6ms5G2PL","price":28.16},
//	{"imageId":"415pJ1ckG3L","price":14.35},
//	{"imageId":"51sPC%2BZ6wDL","price":16.6},
//	{"imageId":"41RzLDlVvkL","price":8.74},
//	{"imageId":"41R0OQKYdUL","price":20},
//	{"imageId":"41%2BBjqmccfL","price":15.66},
//	{"imageId":"51nnNN3bQCL","price":13.65},
//	{"imageId":"41GKFRTQW1L","price":15.08},
//	{"imageId":"51RRqrn1mWL","price":25.62},
//	{"imageId":"41iSOjJZx4L","price":16.34},
//	{"imageId":"41ZdtIu8FOL","price":9.36},
//	{"imageId":"41J8uGUJeLL","price":5.15},
//	{"imageId":"51NFfjEE4yL","price":24.66},
//	{"imageId":"41a7BbkyqwL","price":28.8},
//	{"imageId":"41dTpRAp-BL","price":29.98},
//	{"imageId":"31ZpxFaB7GL","price":11.99},
//	{"imageId":"41k3Hd6BfQL","price":17.19},
//	{"imageId":"51RMjfftgoL","price":12.4},
//	{"imageId":"41SWr1mVthL","price":9.39},
//	{"imageId":"41Y2W0KtAQL","price":16.64},
//	{"imageId":"41wSeV%2B7bgL","price":21.4},
//	{"imageId":"41sitOSv4aL","price":10.54},
//	{"imageId":"41tLT2wbfNL","price":35.85},
//	{"imageId":"41girmZbY%2BL","price":17.04},
//	{"imageId":"51gkaL4qpDL","price":9.44},
//	{"imageId":"41YY4d310IL","price":12.04},
//	{"imageId":"51dMhniRagL","price":25.84},
//	{"imageId":"51OlbfIkUrL","price":9},
//	{"imageId":"31H5umO0eRL","price":8.66},
//	{"imageId":"51a5PGWGnRL","price":18.63},
//	{"imageId":"51Nhzx3ikPL","price":9.63},
//	{"imageId":"41%2B-s0QFD9L","price":16.78},
//	{"imageId":"31gt014zUEL","price":9.6},
//	{"imageId":"51IzN0waWUL","price":37.63},
//	{"imageId":"41yIyOQxzgL","price":11.99},
//	{"imageId":"41YMdn8F1JL","price":12.54},
//	{"imageId":"510kLqRBPeL","price":13.87},
//	{"imageId":"417woAI1qiL","price":12.9},
//	{"imageId":"417VnUcSReL","price":32.25},
//	{"imageId":"517OkJBt66L","price":33.32},
//	{"imageId":"51oeuD6ZYaL","price":11.99},
//	{"imageId":"4188I6W4jJL","price":11.32},
//	{"imageId":"41WGk7KZpVL","price":21.51},
//	{"imageId":"41rlCMQd%2B2L","price":16.15},
//	{"imageId":"41TYm3OVokL","price":14.17},
//	{"imageId":"41vNRDfYeJL","price":12.69},
//	{"imageId":"41dyGJoncTL","price":6.7},
//	{"imageId":"51aiYr2Xt3L","price":17.34},
//	{"imageId":"61beMu5ti-L","price":14.83},
//	{"imageId":"51IyOM%2BMDIL","price":13.26},
//	{"imageId":"41q8pZPaGjL","price":42.2},
//	{"imageId":"41E%2B6xlnFRL","price":12.89},
//	{"imageId":"31CxMQG6k8L","price":20.78},
//	{"imageId":"41oA3L0sIKL","price":11.44},
//	{"imageId":"41x0s0LHUPL","price":10.29},
//	{"imageId":"41UEfYtnjRL","price":30.29},
//	{"imageId":"41a-nJIqkvL","price":14.28},
//	{"imageId":"41-XtY6PHFL","price":19.7},
//	{"imageId":"61HUA%2B3TFyL","price":22.02},
//	{"imageId":"41-6ohEmV7L","price":8.34},
//	{"imageId":"519lxRiGaSL","price":17.23},
//	{"imageId":"51%2BBm-vG-1L","price":13.41},
//	{"imageId":"31%2BfAJ61fWL","price":7.01},
//	{"imageId":"51zpQdBApbL","price":12.18},
//	{"imageId":"41AMcKj5SCL","price":20.24}
]
